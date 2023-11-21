/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { IParamsPricing } from "@constants/params";
import { IGlobalStore, useGlobalStore } from "@stores/globalStore";
import { Form, Popconfirm, Select, Space, Table, message } from "antd";
import flagAustralia from "assets/images/flagAustralia.png";
import flagEurope from "assets/images/flagEurope.png";
import flagIndia from "assets/images/flagIndia.png";
import flagEngland from "assets/images/flagEngland.png";
import flagFrance from "assets/images/flagFrance.png";
import flagGermany from "assets/images/flagGermany.png";
import flagIndonesia from "assets/images/flagIndonesia.png";
import flagItalia from "assets/images/flagItalia.png";
import flagMalaysia from "assets/images/flagMalaysia.png";
import flagPhilippines from "assets/images/flagIndia.png";
import flagRussia from "assets/images/flagRussia.png";
import flagUsa from "assets/images/flagUsa.png";
import { NationEnum } from "constants/nation";
import { IProduct, IProductInTable } from "interfaces/products.interface";
import { IResponseDataStatus } from "interfaces/utils.interface";
import { Key, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import _ from "lodash";
import { CategoryEnum } from "@constants/category";
import { useFormik } from "formik";

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
  const [params, setParams] = useState<IParamsPricing>({});
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
          case NationEnum.ENGLAND:
            return (
              <img
                src={flagEngland}
                alt="flagEngland"
                className={styles.flag}
              />
            );
          case NationEnum.FRANCE:
            return (
              <img src={flagFrance} alt="flagFrance" className={styles.flag} />
            );
          case NationEnum.GERMANY:
            return (
              <img
                src={flagGermany}
                alt="flagGermany"
                className={styles.flag}
              />
            );
          case NationEnum.INDONESIA:
            return (
              <img
                src={flagIndonesia}
                alt="flagIndonesia"
                className={styles.flag}
              />
            );
          case NationEnum.ITALIA:
            return (
              <img src={flagItalia} alt="flagItalia" className={styles.flag} />
            );
          case NationEnum.MALAYSIA:
            return (
              <img
                src={flagMalaysia}
                alt="flagMalaysia"
                className={styles.flag}
              />
            );
          case NationEnum.PHILIPPINES:
            return (
              <img
                src={flagPhilippines}
                alt="flagPhilippines"
                className={styles.flag}
              />
            );
          case NationEnum.RUSSIA:
            return (
              <img src={flagRussia} alt="flagRussia" className={styles.flag} />
            );
          case NationEnum.USA:
            return <img src={flagUsa} alt="flagUsa" className={styles.flag} />;
          default:
            return <p>{nation}</p>;
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
      render: (text: string) => {
        return (
          <p>{text?.[0]?.toUpperCase() + text?.slice(1).replace("_", " ")}</p>
        );
      },
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
                    fetchApi(page, 10, params);
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
  const debounceUpdateParams = useCallback(
    _.debounce((params) => {
      setParams(params);
    }, 200),
    []
  );
  const formik = useFormik({
    initialValues: {
      category: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const fetchApi = async (page: number, limit: number, { ...params }) => {
    const res: IResponseDataStatus = await getProducts(page, limit, {
      ...params,
    });
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
    fetchApi(1, 10, {}).catch(console.log);
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  useEffect(() => {
    setPage(1);
    const formatedParams = {
      page: 1,
      limit: 10,
      category: params.category,
    };

    // @ts-ignore
    fetchApi(1, 10, { ...formatedParams }).catch((error) => {
      console.log(error);
      setListProduct([]);
    });
  }, [params]);

  return (
    <div className={styles.wrapper}>
      <div className="flex justifyBetween alignCenter">
        <h1>Pricing</h1>

        <div className={styles.right}>
          <Form.Item name="category">
            <div className={styles.formItem}>
              <p
                style={{
                  fontWeight: "bold",
                }}
              >
                Category
              </p>
              <Select
                onBlur={formik.handleBlur}
                value={formik.values.category}
                allowClear
                onChange={(e) => {
                  formik.setFieldValue("category", e);
                  debounceUpdateParams({
                    ...params,
                    category: e,
                  });
                }}
                key="language"
                options={Object.values(CategoryEnum).map((item) => {
                  return {
                    label:
                      item[0].toUpperCase() + item.slice(1).replace("_", " "),
                    value: item,
                  };
                })}
              />
            </div>
          </Form.Item>
          <Popconfirm
            title="Delete pricing"
            description="Are you sure to delete?"
            onConfirm={() => {
              Promise.resolve(deleteProduct(selectedRowKeys as string[]))
                .then(() => {
                  void message.success("Delete pricing successfully");
                  fetchApi(page, 10, params);
                  setSelectedRowKeys([]);
                })
                .catch((error) => {
                  console.log(error);
                  message.error("Delete pricing failed");
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
            fetchApi(page, 10, {}).catch(console.log);
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
