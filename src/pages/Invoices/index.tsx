/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { IInvoice } from "@constants/invoices";
import { IResponseDataStatus } from "@interfaces/utils.interface";
import { InvoiceService } from "@services/invoice.service";
import { Popconfirm, Space, Table, message } from "antd";
import dayjs from "dayjs";
import { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

export default function Invoices() {
  const navigate = useNavigate();

  const [listInvoice, setListInvoice] = useState<IInvoice[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

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
                    await InvoiceService.deleteInvoices(invoices);
                    message.success("Delete Invoices successfully");
                    fetchApi(page, 10);
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
                  navigate(`/invoices/edit/${record?._id}`);
                }}
              />
              <EyeOutlined
                className={styles.icon}
                onClick={() => {
                  navigate(`/invoices/detail/${record?._id}`);
                }}
              />
            </Space>
          </div>
        );
      },
    },
  ];

  const fetchApi = async (page: number, limit: number) => {
    try {
      const res: IResponseDataStatus = await InvoiceService.getInvoices(
        page,
        limit
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
    fetchApi(1, 10).catch(console.log);
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
        <h1>Invoices</h1>
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
                  fetchApi(page, 10);
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
            fetchApi(page, 10).catch(console.log);
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
