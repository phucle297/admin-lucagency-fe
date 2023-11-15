/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ICategory } from "@interfaces/categories.interface";
import { CategoriesService } from "@services/categories.service";
import { Popconfirm, Space, Table, message } from "antd";
import { FC, Key, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useDisclosure } from "@hooks/useDisclosure";
import ModalCreateCategory from "../ModalCreateCategory";
import ModalEditCategory from "../ModalEditCategory";

interface ITabelCategoriesProps {
  categories: ICategory[];
  fetchCategories: () => void;
  selectedCategories: ICategory[];
  setSelectedCategories: (selectedCategories: ICategory[]) => void;
}
const TableCategories: FC<ITabelCategoriesProps> = ({
  categories,
  fetchCategories,
  selectedCategories,
  setSelectedCategories,
}) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [categoryToEdit, setCategoryToEdit] = useState<ICategory>(
    {} as ICategory
  );
  const modalCreateCategory = useDisclosure();
  const modalEditCategory = useDisclosure();

  useEffect(() => {
    setDataSource(
      categories.map((item: ICategory) => {
        return {
          key: item._id,
          _id: item._id,
          name: item.name,
        };
      })
    );
  }, [categories]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      fixed: "right",

      render: (_: unknown, record: ICategory) => {
        return (
          <div className={styles.action}>
            <Space>
              <Popconfirm
                title="Delete Category"
                description="Are you sure to delete this category?"
                onConfirm={async () => {
                  try {
                    await CategoriesService.deleteCategory(
                      record._id as string
                    );
                    message.success("Delete user successfully");
                    fetchCategories();
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
                  modalEditCategory.onOpen();
                  setCategoryToEdit(record);
                }}
              />
            </Space>
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    selectedCategories,
    onChange: (newSelectedRowKeys: Key[]) => {
      const newSelectedRows: ICategory[] = categories.filter(
        (item: ICategory) => {
          return newSelectedRowKeys.includes(item._id as string);
        }
      );
      setSelectedCategories(newSelectedRows);
    },
  };
  return (
    <div>
      <div className="flex justifyBetween alignCenter mb10">
        <h2>Categories</h2>
        <Popconfirm
          title="Delete categories"
          description="Are you sure to delete?"
          onConfirm={() => {
            Promise.all([
              selectedCategories.map((category) => {
                return CategoriesService.deleteCategory(category._id as string);
              }),
            ])
              .then(() => {
                void message.success("Delete categories successfully");
                fetchCategories();
                setSelectedCategories([]);
              })
              .catch((error) => {
                console.log(error);
                message.error("Delete categories failed");
              });
          }}
          disabled={selectedCategories.length === 0}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <button
            className={
              selectedCategories.length === 0 ? "disabledBtn" : "primaryBtn"
            }
            disabled={selectedCategories.length === 0}
          >
            Delete
          </button>
        </Popconfirm>
      </div>

      <Table
        dataSource={dataSource}
        scroll={{
          x: 200,
        }}
        // @ts-ignore
        columns={columns}
        pagination={false}
        rowSelection={rowSelection}
      />
      <button
        className="primaryBtn w100 mt10"
        onClick={() => {
          modalCreateCategory.onOpen();
        }}
      >
        Add Category
      </button>

      <ModalCreateCategory
        isOpen={modalCreateCategory.isOpen}
        handleOpen={modalCreateCategory.handleOpen}
        callApi={fetchCategories}
      />
      <ModalEditCategory
        isOpen={modalEditCategory.isOpen}
        handleOpen={modalEditCategory.handleOpen}
        callApi={fetchCategories}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
};
export default TableCategories;
