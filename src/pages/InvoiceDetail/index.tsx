/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { CloseOutlined, DollarOutlined } from "@ant-design/icons";
import { IInvoice, IInvoiceOrderProduct } from "@constants/invoices";
import { IProduct } from "@interfaces/products.interface";
import generatePdf from "@pages/CreateInvoice/pdfGenerator";
import { InvoiceService } from "@services/invoice.service";
import { ProductsService } from "@services/product.service";
import { Col, Divider, Form, Input, Row, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import styles from "./index.module.scss";

const InvoiceDetail: FC = () => {
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
      customer_contact_info: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  const fetchApi = async () => {
    try {
      const resProd = await ProductsService.getProducts(0, 0, {});
      setProducts([
        ...resProd.data.map((item: IProduct) => ({ ...item, key: item._id })),
      ]);
      const invoiceId = location.pathname.split("/").pop() as string;
      const resInvoice = await InvoiceService.getInvoiceById(invoiceId);

      formik.setValues({
        customer_contact_info: resInvoice.data.customer_contact,
        invoice_date: resInvoice.data.invoice_date,
        invoice_number: resInvoice.data.invoice_number,
        order_number: resInvoice.data.order_number,
        paid: resInvoice.data.paid,
        tax: resInvoice.data.tax,
      });

      setListFieldProducts(
        resInvoice.data.order_products.map((item: IInvoiceOrderProduct) => {
          return {
            ...item,
            key: item.service,
          };
        })
      );
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
      // @ts-ignore
      if (typeof formik.values?.paid === Number && formik.values?.paid !== 0) {
        message.error('Please enter "Paid"');
        flag = false;
      }
    }
    if (!formik.values?.tax) {
      // @ts-ignore
      if (typeof formik.values?.tax === Number && formik.values?.tax !== 0) {
        message.error('Please enter "Tax"');
        flag = false;
      }
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
          // @ts-ignore
          if (typeof item?.service === Number && item?.service !== 0) {
            miniflag = false;
          }
        }
        if (!item?.price) {
          // @ts-ignore
          if (typeof item?.price === Number && item?.price !== 0) {
            miniflag = false;
          }
        }
        if (!item?.adjust) {
          // @ts-ignore
          if (typeof item?.adjust === Number && item?.adjust !== 0) {
            miniflag = false;
          }
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
      const invoiceId = location.pathname.split("/").pop() as string;
      if (!checkValidate()) return;
      if (type === "save") {
        await InvoiceService.updateInvoice(invoiceId, invoice_data);
        message.success("Update invoice successfully");
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
            <h1>Invoice Detail</h1>

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
                        type="number"
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
                        type="number"
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
                    <Col xs={24} lg={3}>
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
                              newList[index].quantity = e.target.value;
                              setListFieldProducts(newList);
                            }}
                            value={item?.quantity}
                            name="service"
                          />
                        </div>
                      </Form.Item>
                    </Col>
                    <Col xs={24} lg={9}>
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
                          {/* <Select
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
                          /> */}
                          <Input
                            onChange={(e) => {
                              const newList = [...listFieldProducts];
                              newList[index].service = e.target.value;
                              setListFieldProducts(newList);
                            }}
                            value={item?.service}
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
                  {listFieldProducts
                    .reduce((total, item) => {
                      return (
                        total +
                        Number(item?.price) *
                          Number(item?.quantity) *
                          (1 - Number(item?.adjust) / 100)
                      );
                    }, 0)
                    .toFixed(2)}
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
                  {(
                    listFieldProducts.reduce((total, item) => {
                      return (
                        total +
                        Number(item?.price) *
                          Number(item?.quantity) *
                          (1 - Number(item?.adjust) / 100)
                      );
                    }, 0) -
                    Number(formik.values.paid) -
                    Number(formik.values.tax)
                  ).toFixed(2)}
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

export default InvoiceDetail;
