/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { CheckCircleFilled, UploadOutlined } from "@ant-design/icons";
import { Col, Form, Input, Row, Select, UploadProps, message } from "antd";
import { RcFile } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";
import { CategoryEnum } from "@constants/category";
import { NationEnum } from "@constants/nation";
import { useFormik } from "formik";
import { IProductImage } from "@interfaces/products.interface";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductsService } from "@services/product.service";
import styles from "./index.module.scss";

export default function EditPricing() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<number>(0);
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [defaultFileListKey, setDefaultFileListKey] = useState<string[]>([]);
  const [productId, setProductId] = useState<string>("");
  const formik = useFormik({
    enableReinitialize: true,
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
        const resUpdate = await ProductsService.updateProduct(productId, {
          ...product,
        });

        if (resUpdate?.status === 200) {
          // @ts-ignore

          const listImgWillBeDeleted = defaultFileListKey.filter(
            (item) => !fileList.map((item) => item.uid).includes(item)
          );

          listImgWillBeDeleted?.map((item) => {
            ProductsService.deleteProductImage(item);
          });
          const listWillBeUploaded = fileList.filter(
            (item) => !defaultFileListKey.includes(item.uid)
          );
          listWillBeUploaded.forEach((file: any) => {
            ProductsService.uploadProductImage(productId, file);
          });
        }
        void message.success("Update product successfully!");
      } catch (error) {
        console.log(error);
        // @ts-ignore
        void message.error(error?.message || "Something went wrong!");
      } finally {
        navigate("/pricing");
        formik.resetForm();
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

  const fetchProduct = async (productId: string) => {
    try {
      const res = await ProductsService.getProductById(productId);
      formik.setValues({
        title: res?.title,
        category: res?.category,
        price: res?.price,
        highlight1: res?.highlights[0],
        highlight2: res?.highlights[1],
        highlight3: res?.highlights[2],
        highlight4: res?.highlights[3],
        available_quantity: res?.available_quantity,
        nation: res?.nation,
        discount_price: res?.discount_price,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProductImage = async (productId: string) => {
    try {
      const res = await ProductsService.getProductImages(productId);
      const listKeys: string[] = [];
      if (res.length > 0) {
        setFileList(
          res.map((item: IProductImage) => {
            listKeys.push(item._id);
            return {
              uid: item._id,
              name: item.path.split("/").pop(),
              status: "done",
              url: import.meta.env.VITE_BASE_URL_API.replace("api", item.path),
            };
          })
        );
        setDefaultFileListKey(listKeys);
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      if (error.statusCode === 404) {
        console.log("No image found");
      }
    }
  };
  useEffect(() => {
    const id = location.pathname.split("/")[3];
    setProductId(id);
    fetchProduct(id);
    fetchProductImage(id);
  }, [location.pathname]);

  return (
    <div className={styles.wrapper}>
      <div className="flex justifyBetween alignCenter">
        <h1>Edit Pricing</h1>
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
            Save Change
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
                        label:
                          item[0].toUpperCase() +
                          item.slice(1).replace("_", " "),
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
