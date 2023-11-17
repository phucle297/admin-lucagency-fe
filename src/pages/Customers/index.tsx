/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { CustomerStateEnum, OnlyConsultEnum } from "@constants/customer";
import { ICustomer } from "@interfaces/customer.interface";
import { IResponseDataStatus } from "@interfaces/utils.interface";
import { CustomersService } from "@services/customers.service";
import { Popconfirm, Space, Table, message } from "antd";
import dayjs from "dayjs";
import { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

export default function Customers() {
  const navigate = useNavigate();

  const [listCustomer, setListCustomer] = useState<ICustomer[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [typeOfCustomer, setTypeOfCustomer] = useState<string>(
    OnlyConsultEnum.ORDERS
  );
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => {
        return <p style={{ fontWeight: "bold" }}>{text}</p>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
    },
    {
      title: "Telegram",
      dataIndex: "telegram",
      key: "telegram",
    },
    {
      title: "State",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (state: string) => {
        switch (state) {
          case CustomerStateEnum.COMPLETED:
            return <span className="tagGreen">Completed</span>;
          case CustomerStateEnum.WAITING:
            return <span className="tagYellow">Waiting</span>;
          case CustomerStateEnum.ADVISE:
            return <span className="tagGray">Advising</span>;
          default:
            return <></>;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text: string) => (
        <div>
          <p>{dayjs(text).format("YYYY/MM/DD")}</p>
          <p>{dayjs(text).format("HH:mm a")}</p>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      fixed: "right",
      width: 100,

      render: (_: unknown, record: ICustomer) => {
        return (
          <div className={styles.action}>
            <Space>
              <Popconfirm
                title="Delete Customers"
                description="Are you sure to delete this Customers?"
                onConfirm={async () => {
                  try {
                    // @ts-ignore
                    const Customers = [record._id];
                    await CustomersService.deleteCustomers(Customers);
                    message.success("Delete Customers successfully");
                    fetchApi(
                      page,
                      10,
                      typeOfCustomer === OnlyConsultEnum.ADVISES
                    );
                  } catch (error) {
                    console.log(error);
                    message.success("Delete Customers failed");
                  }
                }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined className={styles.icon} />
              </Popconfirm>
              <EyeOutlined
                className={styles.icon}
                onClick={() => {
                  navigate(`/customers/detail/${record?._id}`);
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
    only_consult: boolean
  ) => {
    try {
      const res: IResponseDataStatus = await CustomersService.getCustomers({
        page,
        limit,
        only_consult,
      });
      const dataListCustomer: ICustomer[] = res.data as ICustomer[];
      setTotal(res.extras?.total as number);
      setListCustomer(
        dataListCustomer.map((item: ICustomer) => {
          return {
            ...item,
            key: item._id,
          };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchApi(1, 10, false).catch(console.log);
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className={styles.wrapper}>
      <div className="flex justifyBetween alignCenter">
        <h1>Customers</h1>
        <div className="flex gap10">
          <button
            className={
              typeOfCustomer === OnlyConsultEnum.ORDERS
                ? "activeBtn"
                : "inactiveBtn"
            }
            onClick={() => {
              setTypeOfCustomer(OnlyConsultEnum.ORDERS);
              fetchApi(page, 10, false);
            }}
          >
            Orders
          </button>
          <button
            className={
              typeOfCustomer === OnlyConsultEnum.ADVISES
                ? "activeBtn"
                : "inactiveBtn"
            }
            onClick={() => {
              setTypeOfCustomer(OnlyConsultEnum.ADVISES);
              fetchApi(page, 10, true);
            }}
          >
            Advises
          </button>

          <Popconfirm
            title="Delete Customers"
            description="Are you sure to delete?"
            onConfirm={() => {
              Promise.resolve(
                CustomersService.deleteCustomers(selectedRowKeys as string[])
              )
                .then(() => {
                  void message.success("Delete Customers successfully");
                  fetchApi(
                    page,
                    10,
                    typeOfCustomer === OnlyConsultEnum.ADVISES
                  );
                  setSelectedRowKeys([]);
                })
                .catch((error) => {
                  console.log(error);
                  message.error("Delete Customers failed");
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
        </div>
      </div>
      <Table
        pagination={{
          total,
          pageSize: 10,
          onChange: (page) => {
            setPage(page);
            fetchApi(
              page,
              10,
              typeOfCustomer === OnlyConsultEnum.ADVISES
            ).catch(console.log);
          },
        }}
        scroll={{ x: 800 }}
        dataSource={listCustomer}
        // @ts-ignore
        columns={columns}
        rowSelection={rowSelection}
      />
    </div>
  );
}
