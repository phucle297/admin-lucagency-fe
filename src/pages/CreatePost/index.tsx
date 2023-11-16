/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import TipTapRichText from "@components/TipTapRichText";
import { LanguagesEnum } from "@constants/languagues";
import { PostStateEnum } from "@constants/posts";
import { DEFAULT_HTML_DATA } from "@constants/utils";
import { ICategory } from "@interfaces/categories.interface";
import { IPost, IPostTranslation } from "@interfaces/posts.interface";
import { CategoriesService } from "@services/categories.service";
import { PostsService } from "@services/posts.service";
import { Col, Row, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeneralInformation from "./GeneralInformation";
import TableCategories from "./TableCategories";
import styles from "./index.module.scss";
import { RcFile } from "antd/es/upload";

export default function CreatePost() {
  const [contentEN, setContentEN] = useState(DEFAULT_HTML_DATA);
  const [contentCN, setContentCN] = useState(DEFAULT_HTML_DATA);

  const [thumbnail, setThumbnail] = useState<RcFile>();
  const [author, setAuthor] = useState<string>("");
  const [generalDataEN, setGeneralDataEN] = useState<IPostTranslation>(
    {} as IPostTranslation
  );
  const [generalDataCN, setGeneralDataCN] = useState<IPostTranslation>(
    {} as IPostTranslation
  );
  const [lang, setLang] = useState<
    LanguagesEnum.ENGLISH | LanguagesEnum.CHINESE
  >(LanguagesEnum.ENGLISH);

  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const navigate = useNavigate();
  const fetchCategories = async () => {
    try {
      const res = await CategoriesService.getCategories();
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const checkValidate = () => {
    let flag = true;
    if (!author) {
      message.error("Please enter author");
      flag = false;
    }
    if (selectedCategories.length === 0) {
      message.error("Please choose category");
      flag = false;
    }
    if (!generalDataEN.title || !generalDataEN.description) {
      message.error(
        "Please enter Title and Description of General Information English"
      );
      flag = false;
    }
    if (!generalDataCN.title || !generalDataCN.description) {
      message.error(
        "Please enter Title and Description of General Information Chinese"
      );
      flag = false;
    }
    if (!contentEN) {
      message.error("Please enter content English");
      flag = false;
    }
    if (!contentCN) {
      message.error("Please enter content Chinese");
      flag = false;
    }
    return flag;
  };
  const handleCreatePost = async (state: PostStateEnum) => {
    try {
      if (!checkValidate()) return;
      const dataCreatePost = {
        author,
        state,
        categories: selectedCategories.map((item) => item.name),
        hot_topic: false,
        translations: [generalDataEN, generalDataCN],
      };

      const resCreatePost = await PostsService.createPost({
        ...dataCreatePost,
      } as IPost);

      const postId = resCreatePost.data._id;

      const formData = new FormData();
      // @ts-ignore
      if (thumbnail?.originFileObj)
        // @ts-ignore
        formData.append("file", thumbnail.originFileObj, `${postId}.jpg`);
      await PostsService.uploadThumbnail(postId, formData);

      const fullHtmlEN = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${generalDataEN.title}</title></head><body>${contentEN}</body></html>`;
      const fullHtmlCN = `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${generalDataCN.title}</title></head><body>${contentCN}</body></html>`;
      // create HTML file and send to server, file have *.html extension

      const blobEN = new Blob([fullHtmlEN], {
        type: "text/html",
      });
      const blobCN = new Blob([fullHtmlCN], { type: "text/html" });

      const formDataEN = new FormData();
      const formDataCN = new FormData();
      formDataEN.append("file", blobEN, `${postId}_EN.html`);
      formDataCN.append("file", blobCN, `${postId}_CN.html`);
      await PostsService.saveContentFile(
        postId,
        LanguagesEnum.ENGLISH,
        formDataEN
      );
      await PostsService.saveContentFile(
        postId,
        LanguagesEnum.CHINESE,
        formDataCN
      );
      message.success("Create post successfully");
      navigate("/posts");
    } catch (error) {
      console.log(error);
      // @ts-ignore
      message.error(error.message);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className="flex justifyBetween alignCenter">
          <h1>New Post</h1>
          <div className="flex gap10">
            <button
              className="inactiveBtn"
              onClick={() => {
                navigate("/posts");
              }}
            >
              Cancel
            </button>
            <button
              className="secondaryBtn"
              onClick={() => {
                handleCreatePost(PostStateEnum.DRAFT);
              }}
            >
              Save As Draft
            </button>
            <button
              className="primaryBtn"
              onClick={() => {
                handleCreatePost(PostStateEnum.PUBLISHED);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <Row gutter={16}>
        <Col xs={24} lg={18}>
          <div className={styles.generalInfo}>
            <GeneralInformation
              setGeneralDataEN={setGeneralDataEN}
              setGeneralDataCN={setGeneralDataCN}
              lang={lang}
              setLang={setLang}
              setThumbnail={setThumbnail}
              setAuthor={setAuthor}
            />
          </div>
          <div className={styles.detailPost}>
            {lang === LanguagesEnum.ENGLISH && (
              <TipTapRichText
                defaultContent={""}
                content={contentEN}
                setContent={(htmlData) => {
                  setContentEN(htmlData);
                }}
              />
            )}
            {lang === LanguagesEnum.CHINESE && (
              <TipTapRichText
                defaultContent={""}
                content={contentCN}
                setContent={(htmlData) => {
                  setContentCN(htmlData);
                }}
              />
            )}
          </div>
        </Col>
        <Col xs={24} lg={6}>
          <div className={styles.categories}>
            <div className={styles.tableCategories}>
              <TableCategories
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                categories={categories}
                fetchCategories={fetchCategories}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
