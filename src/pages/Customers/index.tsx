/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Space, Table } from "antd";
import { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

export default function Customers() {
  const navigate = useNavigate();

  const [listCustomer, setListCustomer] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      fixed: "right",
      width: 100,

      render: (_: unknown, record: unknown) => {
        return (
          <div className={styles.action}>
            <Space>
              <Popconfirm
                title="Delete Customers"
                description="Are you sure to delete this Customers?"
                onConfirm={async () => {
                  // try {
                  //   // @ts-ignore
                  //   const Customers = [record._id];
                  //   await deleteCustomer(Customers);
                  //   message.success("Delete Customers successfully");
                  //   fetchApi(page, 10);
                  // } catch (error) {
                  //   console.log(error);
                  //   message.success("Delete Customers failed");
                  // }
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
                  // @ts-ignore
                  navigate(`/customers/edit/${record?._id}`);
                }}
              />
            </Space>
          </div>
        );
      },
    },
  ];

  const fetchApi = async (page: number, limit: number) => {
    // const res: IResponseDataStatus = await getCustomers(page, limit);
    // const dataListCustomer: ICustomer[] = res.data as ICustomer[];
    // setTotal(res.extras?.total as number);
    // setListCustomer(
    //   dataListCustomer.map((item: ICustomer) => {
    //     return {
    //       _id: item._id,
    //       key: item._id,
    //       title: item.title,
    //       price: item.price,
    //       nation: item.nation,
    //       available_quantity: item.available_quantity,
    //       category: item.category,
    //       discount_price: item.discount_price,
    //       highlights: item.highlights,
    //     };
    //   })
    // );
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
        <h1>Customers</h1>
        <div className="flex gap10">
          <Popconfirm
            title="Delete Customers"
            description="Are you sure to delete?"
            onConfirm={() => {
              // Promise.resolve(deleteCustomer(selectedRowKeys as string[]))
              //   .then(() => {
              //     void message.success("Delete Customers successfully");
              //     fetchApi(page, 10);
              //     setSelectedRowKeys([]);
              //   })
              //   .catch((error) => {
              //     console.log(error);
              //     message.error("Delete Customers failed");
              //   });
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
              navigate("/Customers/create");
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
        dataSource={listCustomer}
        // @ts-ignore
        columns={columns}
        rowSelection={rowSelection}
      />
    </div>
  );
}
