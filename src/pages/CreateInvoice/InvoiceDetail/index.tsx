import { IInvoiceOrderProduct } from "@constants/invoices";
import { ICustomer } from "@interfaces/customer.interface";
import { IProduct } from "@interfaces/products.interface";
import { Col, Divider, Form, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import styles from "./index.module.scss";

interface IInvoiceDetailProps {
  customer: ICustomer;
  products: IProduct[];
}

const InvoiceDetail: FC<IInvoiceDetailProps> = ({ customer }) => {
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

  useEffect(() => {
    if (!customer?._id) return;
    const customerContactInfo =
      customer?.name +
      "\n" +
      customer?.email +
      "\n" +
      customer?.phone +
      "\n" +
      customer?.telegram;
    formik.setFieldValue("customer_contact_info", customerContactInfo);
  }, [customer]);
  return (
    <div className={styles.wrapper}>
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
                    <p className="error">{formik.errors?.invoice_number}</p>
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
          <div className={styles.inputGroup}>
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
            </Row>
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
  );
};

export default InvoiceDetail;
