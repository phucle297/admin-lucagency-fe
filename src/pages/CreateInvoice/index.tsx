/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { CloseOutlined, DollarOutlined } from "@ant-design/icons";
import { IInvoice, IInvoiceOrderProduct } from "@constants/invoices";
import { IProduct } from "@interfaces/products.interface";
import { CustomersService } from "@services/customers.service";
import { InvoiceService } from "@services/invoice.service";
import { ProductsService } from "@services/product.service";
import { Col, Divider, Form, Input, Row, Select, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import styles from "./index.module.scss";
import generatePdf from "./pdfGenerator";

const CreateInvoice: FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([] as IProduct[]);
  const [listFieldProducts, setListFieldProducts] = useState<
    IInvoiceOrderProduct[]
  >([]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      invoice_number: "",
      order_number: "",
      invoice_date: dayjs().format("YYYY-MM-DD"),
      paid: "",
      tax: "",
      customer_contact_info: "",
    },
    validationSchema: Yup.object({
      invoice_number: Yup.string().required("Required"),
      order_number: Yup.string().required("Required"),
      paid: Yup.string().required("Required"),
      tax: Yup.string().required("Required"),
      customer_contact_info: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  const fetchApi = async () => {
    try {
      const resProd = await ProductsService.getProducts();
      setProducts([
        ...resProd.data.map((item: IProduct) => ({ ...item, key: item._id })),
      ]);
      if (!location.search) return;
      const customerId: string = location.search?.split("=").pop() as string;
      const resCustomer = await CustomersService.getCustomerById(customerId);
      // @ts-ignore
      if (!resCustomer?.status === 200) return;
      const customer = resCustomer?.data;
      const customerContactInfo =
        customer?.name +
        "\n" +
        customer?.email +
        "\n" +
        customer?.phone +
        "\n" +
        customer?.telegram;

      formik.setFieldValue("customer_contact_info", customerContactInfo);
      console.log(customer.created_at);
      formik.setFieldValue("invoice_date", dayjs(customer.created_at).format("YYYY-MM-DD"));
    } catch (error) {
      console.log(error);
    }
  };
  const checkValidate = () => {
    let flag = true;
    if (!formik.values?.invoice_number) {
      message.error('Please enter "Invoice Number"');
      flag = false;
    }
    if (!formik.values?.order_number) {
      message.error('Please enter "Order Number"');
      flag = false;
    }
    if (!formik.values?.paid) {
      message.error('Please enter "Paid"');
      flag = false;
    }
    if (!formik.values?.tax) {
      message.error('Please enter "Tax"');
      flag = false;
    }
    if (!formik.values?.customer_contact_info) {
      message.error('Please enter "Customer Contact Info"');
      flag = false;
    }
    if (listFieldProducts.length === 0) {
      message.error("Please enter at least 1 product");
      flag = false;
    }
    if (listFieldProducts.length > 0) {
      listFieldProducts.forEach((item, index) => {
        let miniflag = true;
        if (!item?.quantity) {
          miniflag = false;
        }

        const product: IProduct = products.find(
          (product) => product.title === item?.service
        ) as IProduct;

        if (product?.available_quantity < Number(item?.quantity)) {
          message.error(
            `Product ${
              index + 1
            } has quantity greater than available quantity (Maximum:${
              product?.available_quantity
            })`
          );
          miniflag = false;
        }
        if (!item?.service) {
          miniflag = false;
        }
        if (!item?.price) {
          miniflag = false;
        }
        if (!item?.adjust) {
          miniflag = false;
        }
        if (!miniflag) {
          message.error(`Please enter all field of Product ${index + 1}`);
          flag = false;
        }
      });
    }

    return flag;
  };
  const handleSubmit = async (type: string) => {
    try {
      const sub_total = listFieldProducts.reduce((total, item) => {
        return (
          total +
          Number(item?.price) *
            Number(item?.quantity) *
            (1 - Number(item?.adjust) / 100)
        );
      }, 0);
      const invoice_data: IInvoice = {
        invoice_number: formik.values?.invoice_number,
        order_number: formik.values?.order_number,
        invoice_date: formik.values?.invoice_date,
        customer_contact: formik.values?.customer_contact_info,
        order_products: listFieldProducts.map((item) => ({
          quantity: Number(item?.quantity),
          service: item?.service,
          price: Number(item?.price),
          adjust: Number(item?.adjust),
        })),
        paid: Number(formik.values?.paid),
        tax: Number(formik.values?.tax),
        sub_total,
        total_due:
          sub_total - Number(formik.values?.paid) - Number(formik.values?.tax),
      };
      if (!checkValidate()) return;
      if (type === "save") {
        await InvoiceService.createInvoice(invoice_data);
        message.success("Create invoice successfully");
        navigate("/invoices");
      } else {
        generatePdf(invoice_data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchApi().catch(console.log);
  }, [location.pathname]);

  return (
    <div className={styles.wrapper}>
      <Row gutter={20}>
        <Col xs={24} lg={16}>
          <div className={styles.wrapperInvoiceDetail}>
            <h1>Create Invoice</h1>

            <h2>Export Invoice</h2>

            <Row gutter={20}>
              <Col xs={24} lg={12}>
                <div className={styles.inputGroup}>
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Invoice Number
                  </p>
                  <Form.Item name="invoice_number">
                    <div>
                      <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.invoice_number}
                        name="invoice_number"
                      />
                      {formik.errors?.invoice_number &&
                        formik.touched?.invoice_number && (
                          <p className="error">
                            {formik.errors?.invoice_number}
                          </p>
                        )}
                    </div>
                  </Form.Item>
                </div>
                <div className={styles.inputGroup}>
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Invoice Date
                  </p>
                  <Form.Item name="invoice_date">
                    <div>
                      <Input
                        onChange={(e) => {
                          formik.setFieldValue("invoice_date", e.target.value);
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values?.invoice_date}
                        name="invoice_date"
                        type="date"
                      />
                    </div>
                  </Form.Item>
                </div>
                <div className={styles.inputGroup}>
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Tax
                  </p>
                  <Form.Item name="tax">
                    <div>
                      <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.tax}
                        name="tax"
                      />
                      {formik.errors?.tax && formik.touched?.tax && (
                        <p className="error">{formik.errors?.tax}</p>
                      )}
                    </div>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div className={styles.inputGroup}>
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Order Number
                  </p>
                  <Form.Item name="order_number">
                    <div>
                      <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.order_number}
                        name="order_number"
                      />
                      {formik.errors?.order_number &&
                        formik.touched?.order_number && (
                          <p className="error">{formik.errors?.order_number}</p>
                        )}
                    </div>
                  </Form.Item>
                </div>
                <div className={styles.inputGroup}>
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Paid
                  </p>
                  <Form.Item name="paid">
                    <div>
                      <Input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.paid}
                        name="paid"
                      />
                      {formik.errors?.paid && formik.touched?.paid && (
                        <p className="error">{formik.errors?.paid}</p>
                      )}
                    </div>
                  </Form.Item>
                </div>
                <div className={styles.inputGroup}>
                  <p
                    style={{
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Customer Contact Info
                  </p>
                  <Form.Item name="customer_contact_info">
                    <div>
                      <TextArea
                        rows={5}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.customer_contact_info}
                        name="customer_contact_info"
                      />
                      {formik.errors?.customer_contact_info &&
                        formik.touched?.customer_contact_info && (
                          <p className="error">
                            {formik.errors?.customer_contact_info}
                          </p>
                        )}
                    </div>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <Divider />

            {listFieldProducts.map((item, index) => {
              return (
                <div className={styles.inputGroup} key={index}>
                  <div className="flex justifyBetween alignCenter">
                    <h3>Product {index + 1}</h3>
                    <button
                      className="circleBtn"
                      onClick={() => {
                        const newList = [...listFieldProducts].filter(
                          (_, i) => i !== index
                        );
                        setListFieldProducts(newList);
                      }}
                    >
                      <CloseOutlined />
                    </button>
                  </div>
                  <Row gutter={20}>
                    <Col xs={24} lg={6}>
                      <p
                        style={{
                          fontWeight: "bold",
                          marginBottom: 10,
                        }}
                      >
                        Hrs/Qty
                      </p>
                      <Form.Item name="quantity">
                        <div>
                          <Input
                            type="number"
                            onChange={(e) => {
                              const newList = [...listFieldProducts];
                              console.log(e.target.value);
                              newList[index].quantity = e.target.value;
                              setListFieldProducts(newList);
                            }}
                            value={item?.quantity}
                            name="service"
                          />
                        </div>
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={6}>
                      <p
                        style={{
                          fontWeight: "bold",
                          marginBottom: 10,
                        }}
                      >
                        Service
                      </p>
                      <Form.Item name="service">
                        <div>
                          <Select
                            options={products.map((item) => ({
                              label: item.title,
                              value: item.title,
                            }))}
                            onChange={(e) => {
                              const newList = [...listFieldProducts];
                              newList[index].service = e;
                              newList[index].price = products
                                .find((item) => item.title === e)
                                ?.price?.toString() as string;
                              setListFieldProducts(newList);
                            }}
                            key="service"
                          />
                        </div>
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={6}>
                      <p
                        style={{
                          fontWeight: "bold",
                          marginBottom: 10,
                        }}
                      >
                        Rates/Price (unit: $)
                      </p>
                      <Form.Item name="price">
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          <Input
                            style={{
                              paddingLeft: 30,
                            }}
                            type="number"
                            onChange={(e) => {
                              const newList = [...listFieldProducts];
                              newList[index].price = e.target.value;
                              setListFieldProducts(newList);
                            }}
                            value={item?.price}
                            name="price"
                          />
                          <DollarOutlined
                            style={{
                              position: "absolute",
                              top: "50%",
                              transform: "translateY(-50%)",
                              left: 10,
                            }}
                          />
                        </div>
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={6}>
                      <p
                        style={{
                          fontWeight: "bold",
                          marginBottom: 10,
                        }}
                      >
                        Adjust (unit: %)
                      </p>
                      <Form.Item name="adjust">
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          <Input
                            type="number"
                            onChange={(e) => {
                              const newList = [...listFieldProducts];
                              newList[index].adjust = e.target.value;
                              setListFieldProducts(newList);
                            }}
                            value={item?.adjust}
                            name="price"
                          />
                        </div>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider />
                </div>
              );
            })}
            <button
              className="w100 primaryBtn"
              onClick={() => {
                const newProduct: IInvoiceOrderProduct = {
                  quantity: "",
                  service: "",
                  price: "",
                  adjust: "",
                };
                setListFieldProducts([...listFieldProducts, newProduct]);
              }}
            >
              + Add new product
            </button>
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div className={styles.wrapperPublish}>
            <h1>Publish</h1>
            <div className={styles.publish}>
              <div>
                <p>Sub Total</p>
                <p className={styles.bgGray}>
                  {listFieldProducts.reduce((total, item) => {
                    return (
                      total +
                      Number(item?.price) *
                        Number(item?.quantity) *
                        (1 - Number(item?.adjust) / 100)
                    );
                  }, 0)}
                </p>
              </div>
              <div>
                <p>Tax</p>
                <p className={styles.bgGray}>{Number(formik.values.tax)}</p>
              </div>
              <div>
                <p>Paid</p>
                <p className={styles.bgGray}>{Number(formik.values.paid)}</p>
              </div>
              <div>
                <p>Total due</p>
                <p className={styles.bgGrayBold}>
                  {" "}
                  {listFieldProducts.reduce((total, item) => {
                    return (
                      total +
                      Number(item?.price) *
                        Number(item?.quantity) *
                        (1 - Number(item?.adjust) / 100)
                    );
                  }, 0) -
                    Number(formik.values.paid) -
                    Number(formik.values.tax)}
                </p>
              </div>
            </div>

            <div className={styles.controls}>
              <button
                className={"secondaryBtn w100"}
                onClick={() => {
                  handleSubmit("export");
                }}
              >
                Export Pdf
              </button>
              <button
                className={"primaryBtn w100"}
                onClick={() => {
                  handleSubmit("save");
                }}
              >
                Save
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CreateInvoice;
