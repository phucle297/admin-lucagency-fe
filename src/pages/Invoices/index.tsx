/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { IInvoice } from "@constants/invoices";
import { IParamsSearch } from "@constants/params";
import { IResponseDataStatus } from "@interfaces/utils.interface";
import { InvoiceService } from "@services/invoice.service";
import { Form, Input, Popconfirm, Space, Table, message } from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import _ from "lodash";
import { Key, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

export default function Invoices() {
  const navigate = useNavigate();

  const [listInvoice, setListInvoice] = useState<IInvoice[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [params, setParams] = useState<IParamsSearch>({});

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
      title: "Invoice Number",
      dataIndex: "invoice_number",
      key: "invoice_number",
    },
    {
      title: "Order Number",
      dataIndex: "order_number",
      key: "order_number",
    },
    {
      title: "Price",
      dataIndex: "total_due",
      key: "total_due",
      render: (text: string) => {
        return <span>${Number(text).toLocaleString()}</span>;
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

      render: (_: unknown, record: IInvoice) => {
        return (
          <div className={styles.action}>
            <Space>
              <Popconfirm
                title="Delete Invoices"
                description="Are you sure to delete this Invoices?"
                onConfirm={async () => {
                  try {
                    const invoices = [record._id];
                    await InvoiceService.deleteInvoices(invoices as string[]);
                    message.success("Delete Invoices successfully");
                    fetchApi(page, 10, params);
                  } catch (error) {
                    console.log(error);
                    message.success("Delete Invoices failed");
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
                  navigate(`/invoices/detail/${record?._id}`);
                }}
              />
              <CopyOutlined
                className={styles.icon}
                onClick={async () => {
                  try {
                    const resIn = await InvoiceService.getInvoiceById(
                      record?._id as string
                    );
                    const dataCreateIn = resIn.data as IInvoice;
                    delete dataCreateIn._id;
                    delete dataCreateIn.created_at;
                    delete dataCreateIn.updated_at;
                    delete dataCreateIn.__v;
                    await InvoiceService.createInvoice(dataCreateIn);
                    message.success("Copy Invoices successfully");
                    fetchApi(page, 10, params);
                  } catch (error) {
                    console.log(error);
                    message.success("Copy Invoices failed");
                  }
                }}
              />
            </Space>
          </div>
        );
      },
    },
  ];
  const debounceUpdateParams = useCallback(
    _.debounce((params) => {
      setParams(params);
    }, 200),
    []
  );

  const fetchApi = async (page: number, limit: number, { ...params }) => {
    try {
      const res: IResponseDataStatus = await InvoiceService.getInvoices(
        page,
        limit,
        { ...params }
      );
      const dataListInvoice: IInvoice[] = res.data as IInvoice[];
      setTotal(res.extras?.total as number);
      setListInvoice(
        dataListInvoice.map((item: IInvoice) => {
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
    fetchApi(1, 10, {}).catch(console.log);
  }, []);
  useEffect(() => {
    setPage(1);
    const formatedParams = {
      search: params.search,
    };

    // @ts-ignore
    fetchApi(1, 10, { ...formatedParams }).catch((error) => {
      console.log(error);
      setListInvoice([]);
    });
  }, [params]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className={styles.wrapper}>
      <div className="flex justifyBetween alignBaseline">
        <h1>Invoices</h1>
        <div className={styles.searchAndFilter}>
          <Form.Item
            name="search"
            style={{
              width: "100%",
            }}
          >
            <div>
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
          </Form.Item>
        </div>
        <div className="flex gap10">
          <Popconfirm
            title="Delete Invoices"
            description="Are you sure to delete?"
            onConfirm={() => {
              Promise.resolve(
                InvoiceService.deleteInvoices(selectedRowKeys as string[])
              )
                .then(() => {
                  void message.success("Delete Invoices successfully");
                  fetchApi(page, 10, params);
                  setSelectedRowKeys([]);
                })
                .catch((error) => {
                  console.log(error);
                  message.error("Delete Invoices failed");
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
              navigate("/Invoices/create");
            }}
          >
            Add new
          </button>
        </div>
      </div>
      <Table
        pagination={{
          total,
          pageSize: 10,
          onChange: (page) => {
            setPage(page);
            fetchApi(page, 10, params).catch(console.log);
          },
        }}
        scroll={{ x: 800 }}
        dataSource={listInvoice}
        // @ts-ignore
        columns={columns}
        rowSelection={rowSelection}
      />
    </div>
  );
}
