/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { UploadOutlined } from "@ant-design/icons";
import { LanguagesEnum } from "@constants/languagues";
import { getBase64 } from "@helpers/getBase64";
import { IPostTranslation } from "@interfaces/posts.interface";
import { Form, Input, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import styles from "./index.module.scss";
import TextArea from "antd/es/input/TextArea";
import { useGlobalStore } from "@stores/globalStore";

interface IGeneralInformationProps {
  setGeneralDataEN: (generalDataEN: IPostTranslation) => void;
  setGeneralDataCN: (generalDataCN: IPostTranslation) => void;
  lang: LanguagesEnum.ENGLISH | LanguagesEnum.CHINESE;
  setLang: (lang: LanguagesEnum.ENGLISH | LanguagesEnum.CHINESE) => void;
  setThumbnail: (thumbnail: any) => void;
  setAuthor: (author: string) => void;
}
const GeneralInformation: FC<IGeneralInformationProps> = ({
  setGeneralDataEN,
  setGeneralDataCN,
  lang,
  setLang,
  setAuthor,
  setThumbnail,
}) => {
  const whoAmI = useGlobalStore((state) => state.whoAmI);
  const [fileList, setFileList] = useState<any[]>([]);
  const formik = useFormik({
    initialValues: {
      author: "",
      titleCN: "",
      descriptionCN: "",
      titleEN: "",
      descriptionEN: "",
      thumbnail: "",
    },
    onSubmit: async (values) => {
      try {
        console.log(values);
      } catch (error) {
        console.log(error);
      }
    },
  });
  useEffect(() => {
    setGeneralDataEN({
      language: LanguagesEnum.ENGLISH,
      title: formik.values.titleEN,
      description: formik.values.descriptionEN,
    });
    setGeneralDataCN({
      language: LanguagesEnum.CHINESE,
      title: formik.values.titleCN,
      description: formik.values.descriptionCN,
    });
    setAuthor(formik.values.author);
  }, [formik.values]);
  const uploadProps: UploadProps = {
    name: "image",
    multiple: false,
    accept: "image/jpg, image/jpeg",
    beforeUpload: () => {
      return false;
    },
    listType: "picture-card",
    fileList: fileList,
    onChange: (info: any) => {
      let fileList: any = [...info.fileList];

      fileList = fileList.slice(-1).map((file: any) => {
        let thumbUrl;
        if (file?.originFileObj) {
          thumbUrl = URL.createObjectURL(file?.originFileObj);
        }
        return {
          ...file,
          thumbUrl,
        };
      });

      setThumbnail(fileList[0]);
      setFileList(fileList);
    },
    onPreview: async (file) => {
      if (file?.originFileObj)
        getBase64(file?.originFileObj, (imageUrl: any) => {
          // create a tag and open new tab
          const image = new Image();
          image.src = imageUrl;
          const imgWindow = window.open(imageUrl);
          if (imgWindow) {
            imgWindow.document.write(image.outerHTML);
          }
        });
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  useEffect(() => {
    formik.setFieldValue("author", whoAmI?.name);
  }, [whoAmI]);
  return (
    <div className={styles.wrapper}>
      <h2 className="mb10">General Information</h2>
      <div className={styles.inputGroup}>
        <p
          style={{
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Author
        </p>
        <Form.Item name="name">
          <div>
            <Input
              disabled
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.author}
              name="author"
            />
            {formik.touched.author && formik.errors.author ? (
              <p className="error">{formik.errors.author}</p>
            ) : null}
          </div>
        </Form.Item>
      </div>

      <div className={styles.langs}>
        <button
          className={
            lang === LanguagesEnum.ENGLISH ? "activeBtn" : "inactiveBtn"
          }
          onClick={() => {
            setLang(LanguagesEnum.ENGLISH);
          }}
        >
          English
        </button>
        <button
          className={
            lang === LanguagesEnum.CHINESE ? "activeBtn" : "inactiveBtn"
          }
          onClick={() => {
            setLang(LanguagesEnum.CHINESE);
          }}
        >
          Chinese
        </button>
      </div>

      <div
        style={{
          display: lang === LanguagesEnum.ENGLISH ? "block" : "none",
        }}
      >
        <div className={styles.inputGroup}>
          <p
            style={{
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Title
          </p>
          <Form.Item name="titleEN">
            <div>
              <Input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.titleEN}
                name="titleEN"
              />
              {formik.touched.titleEN && formik.errors.titleEN ? (
                <p className="error">{formik.errors.titleEN}</p>
              ) : null}
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
            Description
          </p>
          <Form.Item name="descriptionEN">
            <div>
              <TextArea
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.descriptionEN}
                name="descriptionEN"
              />
              {formik.touched.descriptionEN && formik.errors.descriptionEN ? (
                <p className="error">{formik.errors.descriptionEN}</p>
              ) : null}
            </div>
          </Form.Item>
        </div>
      </div>

      <div
        style={{
          display: lang === LanguagesEnum.CHINESE ? "block" : "none",
        }}
      >
        <div className={styles.inputGroup}>
          <p
            style={{
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Title
          </p>
          <Form.Item name="titleEN">
            <div>
              <Input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.titleCN}
                name="titleCN"
              />
              {formik.touched.titleCN && formik.errors.titleCN ? (
                <p className="error">{formik.errors.titleCN}</p>
              ) : null}
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
            Description
          </p>
          <Form.Item name="descriptionCN">
            <div>
              <TextArea
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.descriptionCN}
                name="descriptionCN"
              />
              {formik.touched.descriptionCN && formik.errors.descriptionCN ? (
                <p className="error">{formik.errors.descriptionCN}</p>
              ) : null}
            </div>
          </Form.Item>
        </div>
      </div>

      <div className="thumbnailImage">
        <div>
          <Dragger
            {...uploadProps}
            rootClassName={
              fileList.length === 0 ? styles.upload : styles.uploaded
            }
          >
            <>
              <UploadOutlined /> <br />
              <b>Click to upload</b> or drag and drop
              <p>
                JPG {"("}recommend 1260*948{")"}
              </p>
            </>
          </Dragger>
        </div>
      </div>
    </div>
  );
};
export default GeneralInformation;
