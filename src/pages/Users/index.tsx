/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { IParamsUser } from "@constants/params";
import { ITotalListUser } from "@constants/totalList";
import { UserRolesEnum } from "@constants/userRoles";
import { useDisclosure } from "@hooks/useDisclosure";
import { useWidth } from "@hooks/useWidth";
import { IUser } from "@interfaces/users.interface";
import { UsersService } from "@services/users.service";
import { useGlobalStore } from "@stores/globalStore";
import { Input, Popconfirm, Space, Table, message } from "antd";
import { IResponseDataStatus } from "interfaces/utils.interface";
import { Key, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalEditUsers from "./ModalEditUsers";
import styles from "./index.module.scss";
import { useFormik } from "formik";
import _ from "lodash";

export default function Users() {
  const width = useWidth();
  const [tab, setTab] = useState<string>(UserRolesEnum.ALL);
  const navigate = useNavigate();
  const getUsers = useGlobalStore((state) => state.getUsers);
  const [total, setTotal] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [page, setPage] = useState<number>(1);
  const [listUsers, setListUsers] = useState<IUser[]>([]);
  const [params, setParams] = useState<IParamsUser>({
    search: undefined,
  });
  const modalEditUser = useDisclosure();
  const [selectedRow, setSelectedRow] = useState<IUser>({} as IUser);
  const [listTotal, setListTotal] = useState<ITotalListUser>(
    {} as ITotalListUser
  );
  const formik = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text: string) => {
        return (
          <p>
            {text[0].toUpperCase()}
            {text.slice(1)}
          </p>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      render: (text: string) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      fixed: "right",
      width: 100,

      render: (_: unknown, record: IUser) => {
        return (
          <div className={styles.action}>
            <Space>
              <Popconfirm
                title="Delete user"
                description="Are you sure to delete this user?"
                onConfirm={async () => {
                  try {
                    // @ts-ignore
                    const users = [record._id];
                    await UsersService.deleteUsers(users);
                    message.success("Delete user successfully");
                    fetchApi(page, 10, params.search as string);
                  } catch (error) {
                    console.log(error);
                    message.success("Delete user failed");
                  }
                }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined className={styles.icon} />
              </Popconfirm>
              <EditOutlined
                className={styles.icon}
                onClick={() => {
                  setSelectedRow(record);
                  modalEditUser.onOpen();
                }}
              />
            </Space>
          </div>
        );
      },
    },
  ];

  const fetchApi = async (
    page: number,
    limit: number,
    search: string,
    role?: string
  ) => {
    const res: IResponseDataStatus = await getUsers(page, limit, search, role);
    setListUsers(
      // @ts-ignore
      res?.data.map((item: IUser) => ({ ...item, key: item?._id })) as IUser[]
    );
    setTotal(res.extras?.total as number);

    const accountants = res.extras?.accountants as number;
    const sales = res.extras?.sales as number;
    const seo = res.extras?.seo as number;
    const total = accountants + sales + seo;
    setListTotal({
      accountants,
      sales,
      seo,
      total,
    });
  };
  useEffect(() => {
    fetchApi(1, 10, "").catch(console.log);
  }, []);
  useEffect(() => {
    setPage(1);
    if (tab === UserRolesEnum.ALL) {
      fetchApi(1, 10, params.search as string).catch(console.log);
      return;
    } else {
      fetchApi(1, 10, params.search as string, tab).catch((error) => {
        console.log(error);
        setListUsers([]);
      });
    }
  }, [params, tab]);

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const debounceUpdateParams = useCallback(
    _.debounce((params) => {
      setParams(params);
    }, 200),
    []
  );

  return (
    <div className={styles.wrapper}>
      <div className="flex justifyBetween alignCenter gap10">
        <h1
          style={{
            marginBottom: 0,
          }}
        >
          Users
        </h1>
        {width >= 1024 && (
          <div className={styles.tabs}>
            <button
              className={
                tab === UserRolesEnum.ALL ? "activeBtn" : "inactiveBtn"
              }
              onClick={() => {
                setTab(UserRolesEnum.ALL);
              }}
            >
              All users ({listTotal.total})
            </button>
            <button
              className={
                tab === UserRolesEnum.ACCOUNTANT ? "activeBtn" : "inactiveBtn"
              }
              onClick={() => {
                setTab(UserRolesEnum.ACCOUNTANT);
              }}
            >
              Accountant ({listTotal.accountants})
            </button>
            <button
              className={
                tab === UserRolesEnum.SALE ? "activeBtn" : "inactiveBtn"
              }
              onClick={() => {
                setTab(UserRolesEnum.SALE);
              }}
            >
              Sale ({listTotal.sales})
            </button>
            <button
              className={
                tab === UserRolesEnum.SEO ? "activeBtn" : "inactiveBtn"
              }
              onClick={() => {
                setTab(UserRolesEnum.SEO);
              }}
            >
              Seo ({listTotal.seo})
            </button>
          </div>
        )}
        <div className={styles.controls}>
          <Popconfirm
            title="Delete users"
            description="Are you sure to delete?"
            onConfirm={() => {
              Promise.resolve(
                UsersService.deleteUsers(selectedRowKeys as string[])
              )
                .then(() => {
                  void message.success("Delete users successfully");
                  fetchApi(page, 10, params.search as string);
                  setSelectedRowKeys([]);
                })
                .catch((error) => {
                  console.log(error);
                  message.error("Delete users failed");
                });
            }}
            disabled={selectedRowKeys.length === 0}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
          >
            <button
              className={
                selectedRowKeys.length === 0 ? "disabledBtn" : "primaryBtn"
              }
              disabled={selectedRowKeys.length === 0}
            >
              Delete
            </button>
          </Popconfirm>

          <button
            className="primaryBtn"
            onClick={() => {
              navigate("/users/create");
            }}
          >
            Add new user
          </button>
        </div>
      </div>
      {width < 1024 && (
        <div className={styles.tabs}>
          <button
            className={tab === UserRolesEnum.ALL ? "activeBtn" : "inactiveBtn"}
            onClick={() => {
              setTab(UserRolesEnum.ALL);
            }}
          >
            All users
          </button>
          <button
            className={
              tab === UserRolesEnum.ACCOUNTANT ? "activeBtn" : "inactiveBtn"
            }
            onClick={() => {
              setTab(UserRolesEnum.ACCOUNTANT);
            }}
          >
            Accountant
          </button>
          <button
            className={tab === UserRolesEnum.SALE ? "activeBtn" : "inactiveBtn"}
            onClick={() => {
              setTab(UserRolesEnum.SALE);
            }}
          >
            Sale
          </button>
          <button
            className={tab === UserRolesEnum.SEO ? "activeBtn" : "inactiveBtn"}
            onClick={() => {
              setTab(UserRolesEnum.SEO);
            }}
          >
            Seo
          </button>
        </div>
      )}
      <div>
        <p
          style={{
            fontWeight: "bold",
          }}
        >
          Search
        </p>
        <div className={styles.searchBar}>
          <Input
            onBlur={formik.handleBlur}
            onChange={(e) => {
              formik.setFieldValue("search", e.target.value);
              debounceUpdateParams({
                ...params,
                search: e.target.value,
              });
            }}
            value={formik.values.search}
            name="search"
          />
          <SearchOutlined className={styles.searchIcon} />
        </div>
      </div>
      <Table
        pagination={{
          total,
          pageSize: 10,
          onChange: (page) => {
            setPage(page);
            fetchApi(page, 10, params.search as string).catch(console.log);
          },
        }}
        scroll={{ x: 1000 }}
        dataSource={listUsers}
        // @ts-ignore
        columns={columns}
        rowSelection={rowSelection}
      />

      <ModalEditUsers
        isOpen={modalEditUser.isOpen}
        handleOpen={modalEditUser.handleOpen}
        selectedRow={selectedRow}
        callApi={() => {
          fetchApi(page, 10, params.search as string).catch(console.log);
        }}
      />
    </div>
  );
}
