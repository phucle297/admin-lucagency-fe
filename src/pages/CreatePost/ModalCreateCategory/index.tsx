import { Form, Input, Modal, message } from "antd";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import styles from "./index.module.scss";
import { CategoriesService } from "@services/categories.service";

interface IModalCreateCategoryProps {
  isOpen: boolean;
  handleOpen: (open: boolean) => void;
  callApi: () => void;
}
const ModalCreateCategory: FC<IModalCreateCategoryProps> = ({
  isOpen,
  handleOpen,
  callApi,
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
        await CategoriesService.createCategory({ ...values });
        message.success("Create category successfully");
        handleClose();
        await callApi();
      } catch (error) {
        message.error("Create category failed");
        console.log(error);
      }
    },
  });

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
        <h2>Create New Category</h2>
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
          Create
        </button>
      </div>
    </Modal>
  );
};

export default ModalCreateCategory;
