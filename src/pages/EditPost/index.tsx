/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import TipTapRichText from "@components/TipTapRichText";
import { LanguagesEnum } from "@constants/languagues";
import { PostStateEnum } from "@constants/posts";
import { ICategory } from "@interfaces/categories.interface";
import { IPost, IPostTranslation } from "@interfaces/posts.interface";
import { CategoriesService } from "@services/categories.service";
import { PostsService } from "@services/posts.service";
import { Col, Row, Switch, message } from "antd";
import { RcFile } from "antd/es/upload";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeneralInformation from "./GeneralInformation";
import TableCategories from "./TableCategories";
import styles from "./index.module.scss";

export default function EditPost() {
  const [contentEN, setContentEN] = useState<string>("");
  const [contentCN, setContentCN] = useState<string>("");
  const [defaultContentEN, setDefaultContentEN] = useState<string>("");
  const [defaultContentCN, setDefaultContentCN] = useState<string>("");
  const [defaultAuthor, setDefaultAuthor] = useState<string>("");
  const [defaultGeneralDataEN, setDefaultGeneralDataEN] =
    useState<IPostTranslation>({} as IPostTranslation);
  const [defaultGeneralDataCN, setDefaultGeneralDataCN] =
    useState<IPostTranslation>({} as IPostTranslation);
  const [defaultCategories, setDefaultCategories] = useState<string[]>([]);
  const [hotTopic, setHotTopic] = useState<boolean>(false);

  const [checkedPublish, setCheckedPublish] = useState<string>();
  const [defaultThumbnail, setDefaultThumbnail] = useState<Blob>();
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
    if (!selectedCategories.length) {
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
  const handleEditPost = async () => {
    try {
      if (!checkValidate()) return;
      const postId: string = location.pathname.split("/").pop() as string;
      const dataEditPost = {
        author,
        state: checkedPublish,
        categories: selectedCategories.map((item) => item.name),
        hot_topic: hotTopic,
        translations: [generalDataEN, generalDataCN],
      };

      await PostsService.updatePostById(postId, {
        ...dataEditPost,
      } as IPost);

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
      await PostsService.updateContentFile(
        postId,
        LanguagesEnum.ENGLISH,
        formDataEN
      );
      await PostsService.updateContentFile(
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
  const fetchPost = async () => {
    try {
      const resPost = await PostsService.getPostById(
        location.pathname.split("/").pop() as string
      );

      if (resPost.status === 200) {
        setCheckedPublish(resPost.data.state);
        setHotTopic(resPost.data.hot_topic as boolean);
        setDefaultAuthor(resPost.data.author);
        setThumbnail(
          import.meta.env.VITE_BASE_URL_API.replace(
            "api",
            resPost.data.thumbnail_path
          )
        );
        const transEN = resPost.data.translations.find(
          (item: IPostTranslation) => item.language === LanguagesEnum.ENGLISH
        );
        setDefaultGeneralDataEN(transEN);
        const transCN = resPost.data.translations.find(
          (item: IPostTranslation) => item.language === LanguagesEnum.CHINESE
        );
        setDefaultGeneralDataCN(transCN);
        setDefaultCategories(resPost.data.categories);

        const pathThumb = import.meta.env.VITE_BASE_URL_API.replace(
          "api",
          resPost.data.thumbnail_path
        );
        const blob = await fetch(pathThumb).then((res) => res.blob());
        setDefaultThumbnail(blob);

        if (transEN) {
          const pathHTML = import.meta.env.VITE_BASE_URL_API.replace(
            "api",
            transEN.path
          );

          const htmlEN: string = await fetch(pathHTML).then((res) =>
            res.text()
          );
          //  get content in body
          let contentEN = "";
          if (htmlEN)
            // @ts-ignore
            contentEN = htmlEN?.split("<body>").pop().split("</body>")[0];

          setContentEN(contentEN);
          setDefaultContentEN(contentEN);
        }
        if (transCN) {
          const pathHTML = import.meta.env.VITE_BASE_URL_API.replace(
            "api",
            transCN.path
          );

          const htmlCN: string = await fetch(pathHTML).then((res) =>
            res.text()
          );
          //  get content in body
          let contentCN = "";
          if (htmlCN)
            // @ts-ignore
            contentCN = htmlCN?.split("<body>").pop().split("</body>")[0];
          setContentCN(contentCN);
          setDefaultContentCN(contentCN);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!location.pathname.split("/").pop()) return;

    fetchCategories();
    fetchPost();
  }, [location.pathname]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className="flex justifyBetween alignCenter">
          <h1>Edit Post</h1>
          <div className="flex gap10">
            <button
              className="inactiveBtn"
              onClick={() => {
                navigate("/posts");
              }}
            >
              Cancel
            </button>
            <div className="flex gap10 alignCenter">
              <p>Published</p>
              <Switch
                checked={checkedPublish === PostStateEnum.PUBLISHED}
                onChange={(checked) => {
                  setCheckedPublish(
                    checked ? PostStateEnum.PUBLISHED : PostStateEnum.DRAFT
                  );
                }}
              />
            </div>
            <div className="flex gap10 alignCenter">
              <p>Hot Topic</p>
              <Switch
                checked={hotTopic}
                onChange={(checked) => {
                  setHotTopic(checked);
                }}
              />
            </div>
            <button
              className="primaryBtn"
              onClick={() => {
                handleEditPost();
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
              defaultAuthor={defaultAuthor}
              defaultGeneralDataEN={defaultGeneralDataEN}
              defaultGeneralDataCN={defaultGeneralDataCN}
              // @ts-ignore
              defaultThumbnail={defaultThumbnail}
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
                defaultContent={defaultContentEN}
                content={contentEN}
                setContent={(htmlData) => {
                  setContentEN(htmlData);
                }}
              />
            )}
            {lang === LanguagesEnum.CHINESE && (
              <TipTapRichText
                defaultContent={defaultContentCN}
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
                defaultCategories={defaultCategories}
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
