/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { CheckCircleFilled, UploadOutlined } from "@ant-design/icons";
import { Col, Form, Input, Row, Select, UploadProps, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { CategoryEnum } from "constants/category";
import { NationEnum } from "constants/nation";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductsService } from "services/product.service";
import { useGlobalStore } from "store/globalStore";
import styles from "./index.module.scss";

export default function CreatePricing() {
  const navigate = useNavigate();
  const createProduct = useGlobalStore((state) => state.createProduct);
  const [tab, setTab] = useState<number>(0);
  const [fileList, setFileList] = useState([]);
  const formik = useFormik({
    initialValues: {
      title: "",
      category: "",
      price: "",
      highlight1: "",
      highlight2: "",
      highlight3: "",
      highlight4: "",
      available_quantity: "",
      nation: "",
      discount_price: "",
    },
    onSubmit: async (values: any) => {
      try {
        const product = {
          ...values,
          highlights: [
            values.highlight1,
            values.highlight2,
            values.highlight3,
            values.highlight4,
          ].filter((item) => item),
          price: Number(values.price),
          discount_price: Number(values.discount_price),
          available_quantity: Number(values.available_quantity),
        };
        delete product.highlight1;
        delete product.highlight2;
        delete product.highlight3;
        delete product.highlight4;

        const resCreate = await createProduct(product);
        Promise.resolve(() => {
          if (resCreate) {
            // @ts-ignore
            const productId = resCreate?.data?._id;
            fileList.forEach((file: any) => {
              ProductsService.uploadProductImage(productId, file);
            });
          }
        }).then(() => {
          void message.success("Create product successfully!");
          navigate("/pricing");
          setFileList([]);
          formik.resetForm();
        });
      } catch (error) {
        console.log(error);
        // @ts-ignore
        void message.error(error?.message || "Something went wrong!");
      }
    },
  });
  const handleChange = (info: any) => {
    let fileList: any = [...info.fileList];

    fileList = fileList.slice(-5);

    setFileList(fileList);
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: () => {
      return false;
    },
    listType: "picture",
    accept: "image/jpg, image/jpeg",
    fileList,
    onChange: handleChange,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className={styles.wrapper}>
      <div className="flex justifyBetween alignCenter">
        <h1>New Pricing</h1>
        <div className="flex gap10">
          <button
            className="secondaryBtn"
            onClick={() => {
              navigate("/pricing");
            }}
          >
            Cancel
          </button>
          <button
            className="primaryBtn"
            onClick={() => {
              formik.handleSubmit();
            }}
          >
            Submit
          </button>
        </div>
      </div>

      <div className="flex gap5">
        <div className={styles.tabItem}>
          <button
            className={tab === 0 ? "activeBtn" : "inactiveBtn"}
            onClick={() => {
              setTab(0);
            }}
          >
            General
          </button>
        </div>
        <div className={styles.tabItem}>
          <button
            className={tab === 1 ? "activeBtn" : "inactiveBtn"}
            onClick={() => {
              setTab(1);
            }}
          >
            Description Images
          </button>
        </div>
      </div>

      {tab === 0 && (
        <div className={styles.contentCreate}>
          <Row gutter={20}>
            <Col xs={24} lg={12}>
              <div className={styles.inputGroup}>
                <p
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Pricing Name
                </p>
                <Form.Item name="title">
                  <div>
                    <Input
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.title}
                      name="title"
                    />
                  </div>
                </Form.Item>
              </div>
              <div className={styles.inputGroup}>
                <p
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Pricing Category
                </p>
                <Form.Item>
                  <div>
                    <Select
                      style={{ width: "100%" }}
                      options={Object.values(CategoryEnum).map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      onChange={(e) => {
                        formik.setFieldValue("category", e);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.category}
                      key="category"
                    />
                  </div>
                </Form.Item>
              </div>
              <div className={styles.inputGroup}>
                <p
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Price
                </p>
                <Form.Item name="price">
                  <div>
                    <Input
                      type="number"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.price}
                      name={"price"}
                    />
                  </div>
                </Form.Item>
              </div>
              <div className={styles.inputGroupHighlight}>
                <p
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Highlights
                </p>
                <Form.Item name="highlight1">
                  <div className={styles.input}>
                    <Input
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.highlight1}
                      name={"highlight1"}
                    />
                    <CheckCircleFilled className={styles.icon} />
                  </div>
                </Form.Item>
              </div>
              <div className={styles.inputGroupHighlight}>
                <Form.Item name="highlight2">
                  <div className={styles.input}>
                    <Input
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.highlight2}
                      name={"highlight2"}
                    />
                    <CheckCircleFilled className={styles.icon} />
                  </div>
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className={styles.inputGroup}>
                <p
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Available
                </p>
                <Form.Item name="available_quantity">
                  <div>
                    <Input
                      type="number"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.available_quantity}
                      name="available_quantity"
                    />
                  </div>
                </Form.Item>
              </div>
              <div className={styles.inputGroup}>
                <p
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Nation
                </p>
                <Form.Item name="nation">
                  <div>
                    <Select
                      style={{ width: "100%" }}
                      options={Object.values(NationEnum).map((item) => ({
                        label: item,
                        value: item,
                      }))}
                      onChange={(value) => {
                        formik.setFieldValue("nation", value);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.nation}
                      key={"nation"}
                    />
                  </div>
                </Form.Item>
              </div>
              <div className={styles.inputGroup}>
                <p
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Discount Price
                </p>
                <Form.Item name="discount_price">
                  <div>
                    <Input
                      type="number"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.discount_price}
                      name="discount_price"
                    />
                  </div>
                </Form.Item>
              </div>

              <div className={styles.inputGroupHighlight}>
                <p
                  style={{
                    opacity: 0,
                    visibility: "hidden",
                  }}
                >
                  Highlights
                </p>
                <Form.Item name="highlight3">
                  <div className={styles.input}>
                    <Input
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.highlight3}
                      name={"highlight3"}
                    />
                    <CheckCircleFilled className={styles.icon} />
                  </div>
                </Form.Item>
              </div>
              <div className={styles.inputGroupHighlight}>
                <Form.Item name="highlight4">
                  <div className={styles.input}>
                    <Input
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.highlight4}
                      name={"highlight4"}
                    />
                    <CheckCircleFilled className={styles.icon} />
                  </div>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {tab === 1 && (
        <Dragger {...props} rootClassName={styles.upload}>
          <>
            <UploadOutlined /> <br />
            <b>Click to upload</b> or drag and drop
            <p>
              JPG {"("}recommend 1260*948{")"}
            </p>
          </>
        </Dragger>
      )}
    </div>
  );
}
