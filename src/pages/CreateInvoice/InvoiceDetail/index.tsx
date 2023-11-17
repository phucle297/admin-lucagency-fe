import { ICustomer } from "@interfaces/customer.interface";
import { IProduct } from "@interfaces/products.interface";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { FC, useEffect } from "react";
import * as Yup from "yup";
import styles from "./index.module.scss";
import { Col, Form, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";

interface IInvoiceDetailProps {
  customer: ICustomer;
  products: IProduct[];
}

const InvoiceDetail: FC<IInvoiceDetailProps> = ({ customer }) => {
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
    }),
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
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
            <Form.Item name="paid">
              <div>
                <TextArea
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
        </Col>
      </Row>
    </div>
  );
};

export default InvoiceDetail;
