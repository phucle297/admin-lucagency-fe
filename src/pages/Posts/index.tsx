/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  PostHotTopicEnum,
  PostLanguageEnum,
  PostLanguageEnumText,
  PostStateEnum,
} from "@constants/posts";
import { useWidth } from "@hooks/useWidth";
import { IPost } from "@interfaces/posts.interface";
import { useGlobalStore } from "@stores/globalStore";
import {
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  message,
} from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { IResponseDataStatus } from "interfaces/utils.interface";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import _ from "lodash";
import { PostsService } from "@services/posts.service";

export default function Posts() {
  const width = useWidth();
  const navigate = useNavigate();
  const getPosts = useGlobalStore((state) => state.getPosts);
  const [total, setTotal] = useState<number>(0);
  const [listPosts, setListPosts] = useState<IPost[]>([]);
  const [listHotTopic, setListHotTopic] = useState<
    { _id: string; hot_topic: boolean }[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [params, setParams] = useState<{
    page: number;
    limit: number;
    search: string | undefined;
    state: string | undefined;
    hot_topic: boolean | string | undefined;
    language: string | undefined;
  }>({
    page: 1,
    limit: 10,
    search: undefined,
    state: PostStateEnum.ALL,
    hot_topic: undefined,
    language: undefined,
  });
  const formik = useFormik({
    initialValues: {
      search: undefined,
      state: undefined,
      hot_topic: undefined,
      language: undefined,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => {
        return (
          <p>
            {id.slice(0, 4)}...{id.slice(-6)}
          </p>
        );
      },
    },
    { title: "Author", dataIndex: "author", key: "author" },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_: string, record: IPost) => {
        return record?.categories?.join(", ");
      },
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      align: "center",
      render: (state: string) => {
        switch (state) {
          case PostStateEnum.PUBLISHED:
            return <span className="tagGreen">Published</span>;
          case PostStateEnum.DRAFT:
            return <span className="tagGray">Draft</span>;
          default:
            return <></>;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: string) => {
        return (
          <div>
            <p>{dayjs(date).format("YYYY/MM/DD")}</p>
            <p>{dayjs(date).format("HH:mm a")}</p>
          </div>
        );
      },
    },
    {
      title: "Hot Topic",
      dataIndex: "hot_topic",
      key: "hot_topic",
      render: (_: boolean, record: IPost) => {
        return (
          <Switch
            // @ts-ignore
            checked={
              listHotTopic?.find((item) => item._id === record._id)?.hot_topic
            }
            onChange={async (e) => {
              try {
                await PostsService.updatePostById(record._id as string, {
                  ...record,
                  hot_topic: e,
                });
                message.success("Update hot topic successfully");

                setListHotTopic(
                  listHotTopic?.map((item) => {
                    if (item._id === record._id) {
                      return {
                        ...item,
                        hot_topic: e,
                      };
                    }
                    return item;
                  })
                );
              } catch (error) {
                console.log(error);
                // @ts-ignore
                message.error(error?.message);
              }
            }}
          />
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
                title="Delete post"
                description="Are you sure to delete this post?"
                onConfirm={async () => {
                  try {
                    // @ts-ignore
                    await PostsService.deletePostById(record._id);
                    message.success("Delete user successfully");
                    //@ts-ignore
                    fetchApi({ ...params });
                  } catch (error) {
                    console.log(error);
                    message.success("Delete user failed");
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
                  navigate(`/posts/edit/${record?._id}`);
                }}
              />
            </Space>
          </div>
        );
      },
    },
  ];

  const fetchApi = async ({
    ...params
  }: {
    page: number;
    limit: number;
    search: string | undefined;
    state: string | undefined;
    hot_topic: boolean | undefined;
    language: string | undefined;
  }) => {
    const { page, limit, search, state, hot_topic, language } = params;
    let formatedParams = {
      page,
      limit,
      search,
      state,
      hot_topic,
      language,
    };
    if (params.state === PostStateEnum.ALL) {
      formatedParams = {
        ...formatedParams,
        state: undefined,
      };
    }

    if (params.language === PostLanguageEnum.ALL) {
      formatedParams = {
        ...formatedParams,
        language: undefined,
      };
    }
    const res: IResponseDataStatus = await getPosts(
      formatedParams?.page,
      formatedParams?.limit,
      formatedParams?.search,
      formatedParams?.state,
      formatedParams?.hot_topic as boolean | undefined,
      formatedParams?.language
    );
    setListPosts(
      // @ts-ignore
      res?.data.map((item: IPost) => ({ ...item, key: item?._id })) as IPost[]
    );
    setListHotTopic(
      // @ts-ignore
      res?.data.map((item: IPost) => ({
        _id: item?._id,
        hot_topic: item?.hot_topic,
      }))
    );
    setTotal(res.extras?.total as number);
  };
  useEffect(() => {
    fetchApi({
      page: 1,
      limit: 10,
      search: undefined,
      state: undefined,
      hot_topic: undefined,
      language: undefined,
    }).catch(console.log);
  }, []);
  const debounceUpdateParams = useCallback(
    _.debounce((params) => {
      setParams(params);
    }, 200),
    []
  );
  useEffect(() => {
    setPage(1);
    let formatedParams = {
      page: 1,
      limit: 10,
      search: params.search,
      state: params.state,
      hot_topic: params.hot_topic,
      language: params.language,
    };
    if (params.state === PostStateEnum.ALL) {
      formatedParams = {
        ...formatedParams,
        state: undefined,
      };
    }

    if (params.language === PostLanguageEnum.ALL) {
      formatedParams = {
        ...formatedParams,
        language: undefined,
      };
    }
    // @ts-ignore
    fetchApi({ ...formatedParams }).catch((error) => {
      console.log(error);
      setListPosts([]);
    });
  }, [params]);

  const expandedRowRender = (record: IPost) => {
    const columns = [
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Language",
        dataIndex: "language",
        key: "language",
        align: "center",
      },
      { title: "Description", dataIndex: "description", key: "description" },
      {
        title: "Path",
        dataIndex: "path",
        key: "path",
        render: (path: string) => {
          return (
            <a
              target="_blank"
              href={import.meta.env.VITE_BASE_URL_API.replace("api", path)}
            >
              {import.meta.env.VITE_BASE_URL_API.replace("api", path)}
            </a>
          );
        },
      },
    ];
    const data = [];
    // @ts-ignore
    for (let i = 0; i < record?.translations?.length; ++i) {
      if (record?.translations?.[i] && record?.translations) {
        data.push({
          key: nanoid(),
          title: record?.translations[i]?.title,
          language: record?.translations[i]?.language,
          description: record?.translations[i]?.description,
          path: record?.translations[i]?.path,
        });
      }
    }
    // @ts-ignore
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  return (
    <div className={styles.wrapper}>
      <div className="flex justifyBetween alignCenter gap10">
        <h1
          style={{
            marginBottom: 0,
          }}
        >
          Posts
        </h1>
        {width >= 1024 && (
          <div className={styles.tabs}>
            <button
              className={
                params.state === PostStateEnum.ALL ? "activeBtn" : "inactiveBtn"
              }
              onClick={() => {
                debounceUpdateParams({
                  ...params,
                  state: PostStateEnum.ALL,
                });
              }}
            >
              All posts
            </button>
            <button
              className={
                params.state === PostStateEnum.PUBLISHED
                  ? "activeBtn"
                  : "inactiveBtn"
              }
              onClick={() => {
                debounceUpdateParams({
                  ...params,
                  state: PostStateEnum.PUBLISHED,
                });
              }}
            >
              Published
            </button>
            <button
              className={
                params.state === PostStateEnum.DRAFT
                  ? "activeBtn"
                  : "inactiveBtn"
              }
              onClick={() => {
                debounceUpdateParams({
                  ...params,
                  state: PostStateEnum.DRAFT,
                });
              }}
            >
              Draft
            </button>
          </div>
        )}
        <div className={styles.controls}>
          <button
            className="primaryBtn"
            onClick={() => {
              navigate("/posts/create");
            }}
          >
            Add new post
          </button>
        </div>
      </div>
      {width < 1024 && (
        <div className={styles.tabs}>
          <button
            className={
              params.state === PostStateEnum.ALL ? "activeBtn" : "inactiveBtn"
            }
            onClick={() => {
              debounceUpdateParams({
                ...params,
                state: PostStateEnum.ALL,
              });
            }}
          >
            All posts
          </button>
          <button
            className={
              params.state === PostStateEnum.PUBLISHED
                ? "activeBtn"
                : "inactiveBtn"
            }
            onClick={() => {
              debounceUpdateParams({
                ...params,
                state: PostStateEnum.PUBLISHED,
              });
            }}
          >
            Published
          </button>
          <button
            className={
              params.state === PostStateEnum.DRAFT ? "activeBtn" : "inactiveBtn"
            }
            onClick={() => {
              debounceUpdateParams({
                ...params,
                state: PostStateEnum.DRAFT,
              });
            }}
          >
            Draft
          </button>
        </div>
      )}
      <div className={styles.searchAndFilter}>
        <Form.Item
          name="search"
          style={{
            width: "100%",
          }}
        >
          <div>
            <p
              style={{
                fontWeight: "bold",
              }}
            >
              Search
            </p>
            <Input
              onBlur={formik.handleBlur}
              onChange={(e) => {
                formik.setFieldValue("search", e.target.value);
                debounceUpdateParams({
                  ...params,
                  search: e.target.value,
                });
              }}
              value={formik.values.search}
              name="search"
            />
          </div>
        </Form.Item>

        <Form.Item
          name="language"
          style={{
            width: "33%",
          }}
        >
          <div>
            <p
              style={{
                fontWeight: "bold",
              }}
            >
              Language
            </p>
            <Select
              onBlur={formik.handleBlur}
              value={formik.values.language}
              onChange={(e) => {
                formik.setFieldValue("language", e);
                debounceUpdateParams({
                  ...params,
                  language: e,
                });
              }}
              key="language"
              defaultValue={PostLanguageEnum.ALL}
              options={[
                {
                  label: PostLanguageEnumText.ALL,
                  value: PostLanguageEnum.ALL,
                },
                {
                  label: PostLanguageEnumText.EN,
                  value: PostLanguageEnum.EN,
                },
                {
                  label: PostLanguageEnumText.CN,
                  value: PostLanguageEnum.CN,
                },
              ]}
            />
          </div>
        </Form.Item>
        <Form.Item
          name="hot_topic"
          style={{
            width: "33%",
          }}
        >
          <div>
            <p
              style={{
                fontWeight: "bold",
              }}
            >
              Hot Topic
            </p>
            <Select
              onBlur={formik.handleBlur}
              value={formik.values.hot_topic}
              onChange={(e) => {
                let ht: boolean | undefined;
                if (e === PostHotTopicEnum.ALL) {
                  ht = undefined;
                } else {
                  // @ts-ignore
                  ht = e;
                }
                formik.setFieldValue("hot_topic", e);
                debounceUpdateParams({
                  ...params,
                  hot_topic: ht,
                });
              }}
              key="hot_topic"
              defaultValue={PostHotTopicEnum.ALL}
              options={[
                {
                  label: PostHotTopicEnum.ALL,
                  value: PostHotTopicEnum.ALL,
                },
                {
                  label: PostHotTopicEnum.TRUE,
                  value: true,
                },
                {
                  label: PostHotTopicEnum.FALSE,
                  value: false,
                },
              ]}
            />
          </div>
        </Form.Item>
      </div>
      <Table
        pagination={{
          total,
          pageSize: 10,
          current: page,
          onChange: (page) => {
            setPage(page);
            // @ts-ignore
            fetchApi({ ...params, page }).catch(console.log);
          },
        }}
        scroll={{ x: 1000 }}
        dataSource={listPosts}
        // @ts-ignore
        columns={columns}
        expandable={{ expandedRowRender }}
      />
    </div>
  );
}
