/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Space, Table, message } from "antd";
import flagAustralia from "assets/images/flagAustralia.png";
import flagEurope from "assets/images/flagEurope.png";
import flagIndia from "assets/images/flagIndia.png";
import { NationEnum } from "constants/nation";
import { IProduct, IProductInTable } from "interfaces/products.interface";
import { IResponseDataStatus } from "interfaces/utils.interface";
import { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IGlobalStore, useGlobalStore } from "store/globalStore";
import styles from "./index.module.scss";

export default function Pricing() {
  const navigate = useNavigate();
  const getProducts = useGlobalStore(
    (state: IGlobalStore) => state.getProducts
  );
  const deleteProduct = useGlobalStore(
    (state: IGlobalStore) => state.deleteProduct
  );
  const [listProduct, setListProduct] = useState<IProductInTable[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 150,
      render: (text: string) => {
        return <p style={{ fontWeight: "bold" }}>{text}</p>;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (text: number) => {
        return <p>${text.toFixed(2)}</p>;
      },
    },
    {
      title: "Nation",
      dataIndex: "nation",
      key: "nation",
      align: "center",
      width: 150,

      render: (nation: string) => {
        switch (nation) {
          case NationEnum.RANDOM:
            return <p>Random</p>;
          case NationEnum.ASIA:
            return <p>Asia</p>;
          case NationEnum.AUSTRALIA:
            return (
              <img
                src={flagAustralia}
                alt="flagAustralia"
                className={styles.flag}
              />
            );
          case NationEnum.EUROPE:
            return (
              <img src={flagEurope} alt="flagEurope" className={styles.flag} />
            );
          case NationEnum.INDIA:
            return (
              <img src={flagIndia} alt="flagIndia" className={styles.flag} />
            );
          case NationEnum.NORTH_AMERICA:
            return <p>North America</p>;
          case NationEnum.SOUTH_AMERICA:
            return <p>South America</p>;
          default:
            return <></>;
        }
      },
    },
    {
      title: "Available",
      dataIndex: "available_quantity",
      key: "available_quantity",
      align: "center",
      render: (text: number) => {
        return <p>{text.toLocaleString()}</p>;
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
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
                title="Delete pricing"
                description="Are you sure to delete this pricing?"
                onConfirm={async () => {
                  try {
                    // @ts-ignore
                    const products = [record._id];

                    await deleteProduct(products);
                    message.success("Delete pricing successfully");
                    fetchApi(page, 10);
                  } catch (error) {
                    console.log(error);
                    message.success("Delete pricing failed");
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
                  // @ts-ignore
                  navigate(`/pricing/edit/${record?._id}`);
                }}
              />
            </Space>
          </div>
        );
      },
    },
  ];

  const fetchApi = async (page: number, limit: number) => {
    const res: IResponseDataStatus = await getProducts(page, limit);
    const dataListProduct: IProduct[] = res.data as IProduct[];
    setTotal(res.extras?.total as number);
    setListProduct(
      dataListProduct.map((item: IProduct) => {
        return {
          _id: item._id,
          key: item._id,
          title: item.title,
          price: item.price,
          nation: item.nation,
          available_quantity: item.available_quantity,
          category: item.category,
          discount_price: item.discount_price,
          highlights: item.highlights,
        };
      })
    );
  };
  useEffect(() => {
    fetchApi(1, 10).catch(console.log);
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className={styles.wrapper}>
      <div className="flex justifyBetween alignCenter">
        <h1>Pricing</h1>
        <div className="flex gap10">
          <button
            className={
              selectedRowKeys.length === 0 ? "disabledBtn" : "primaryBtn"
            }
            onClick={() => {
              console.log(selectedRowKeys);
              Promise.resolve(deleteProduct(selectedRowKeys as string[]))
                .then(() => {
                  void message.success("Delete pricing successfully");
                  fetchApi(page, 10);
                  setSelectedRowKeys([]);
                })
                .catch((error) => {
                  console.log(error);
                  message.error("Delete pricing failed");
                });
            }}
            disabled={selectedRowKeys.length === 0}
          >
            Delete
          </button>
          <button
            className="primaryBtn"
            onClick={() => {
              navigate("/pricing/create");
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
        dataSource={listProduct}
        // @ts-ignore
        columns={columns}
        rowSelection={rowSelection}
      />
    </div>
  );
}
