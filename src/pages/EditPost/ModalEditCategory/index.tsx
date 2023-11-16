/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input, Modal, message } from "antd";
import { useFormik } from "formik";
import { FC, useEffect } from "react";
import * as Yup from "yup";
import styles from "./index.module.scss";
import { CategoriesService } from "@services/categories.service";
import { ICategory } from "@interfaces/categories.interface";

interface IModalEditCategoryProps {
  isOpen: boolean;
  handleOpen: (open: boolean) => void;
  callApi: () => void;
  categoryToEdit: ICategory;
}
const ModalEditCategory: FC<IModalEditCategoryProps> = ({
  isOpen,
  handleOpen,
  callApi,
  categoryToEdit,
}) => {
  const handleClose = () => {
    handleOpen(false);
    formik.resetForm();
  };
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        await CategoriesService.updateCategory(categoryToEdit._id as string, {
          ...values,
        });
        handleClose();
        message.success("Update category successfully");
        await callApi();
      } catch (error) {
        message.error("Update category failed");
        console.log(error);
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: categoryToEdit.name,
    });
  }, [categoryToEdit.name]);
  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        handleClose();
      }}
      footer={null}
      className={styles.modal}
    >
      <div className={styles.header}>
        <h2>Edit Category</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.inputGroup}>
          <p
            style={{
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Category Name
          </p>
          <Form.Item name="name">
            <div>
              <Input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
                name="name"
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="error">{formik.errors.name}</p>
              ) : null}
            </div>
          </Form.Item>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          className="secondaryBtn"
          onClick={() => {
            handleClose();
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
          Save
        </button>
      </div>
    </Modal>
  );
};

export default ModalEditCategory;
