/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { UserRolesEnum } from "@constants/userRoles";
import { IUser } from "@interfaces/users.interface";
import { UsersService } from "@services/users.service";
import { Form, Input, Modal, Select, Switch, message } from "antd";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import styles from "./index.module.scss";

interface IModalEditUsersProps {
  isOpen: boolean;
  handleOpen: (open: boolean) => void;
  selectedRow: IUser;
  callApi: () => void;
}
const ModalEditUsers: FC<IModalEditUsersProps> = ({
  isOpen,
  handleOpen,
  selectedRow,
  callApi,
}) => {
  const [isResetPassword, setIsResetPassword] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const formik = useFormik({
    initialValues: {
      name: "",
      role: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required!"),
      email: Yup.string()
        .email("Invalid email format!")
        .required("Email is required!"),
      // only check password when isResetPassword is true
      password: isResetPassword
        ? Yup.string()
            .required("Password is required!")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])(?=.{8,})/,
              "Password must contain at least 8 characters, one uppercase, one number and one special case character (!@#$%^&*)"
            )
        : Yup.string(),
      confirm_password: isResetPassword
        ? Yup.string()
            .required("Confirm password is required!")
            // @ts-ignore
            .oneOf([Yup.ref("password"), null], "Passwords must match")
        : Yup.string(),
    }),

    onSubmit: async (values: any) => {
      try {
        const user = {
          ...values,
        };
        delete user.confirm_password;
        if (!isResetPassword) {
          delete user.password;
        }
        await UsersService.updateUser(userId, user);
        void message.success("Update user successfully!");
        callApi();
        handleClose();
      } catch (error) {
        console.log(error);
        // @ts-ignore
        void message.error(error?.message || "Something went wrong!");
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: selectedRow?.name || "",
      role: selectedRow?.role || "",
      email: selectedRow?.email || "",
      password: "",
      confirm_password: "",
    });
    setUserId(selectedRow?._id || "");
  }, [selectedRow]);

  const handleClose = () => {
    handleOpen(false);
  };
  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        handleClose();
      }}
      footer={null}
      className={styles.modal}
    >
      <h2>Edit User</h2>
      <div className={styles.content}>
        <div className={styles.inputGroup}>
          <p
            style={{
              fontWeight: "bold",
            }}
          >
            Name
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
                <p className="error">{formik.errors.name as string}</p>
              ) : null}
            </div>
          </Form.Item>
        </div>
        <div className={styles.inputGroup}>
          <p
            style={{
              fontWeight: "bold",
            }}
          >
            Email
          </p>
          <Form.Item name="email">
            <div>
              <Input
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                name="email"
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="error">{formik.errors.email as string}</p>
              ) : null}
            </div>
          </Form.Item>
        </div>
        <div className={styles.inputGroup}>
          <p
            style={{
              fontWeight: "bold",
            }}
          >
            Role
          </p>
          <Form.Item name="role">
            <div>
              <Select
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.setFieldValue("role", e);
                }}
                value={formik.values.role}
                options={Object.values(UserRolesEnum)
                  .slice(1)
                  .map((item) => ({
                    label: item[0].toUpperCase() + item.slice(1),
                    value: item,
                  }))}
                key={"role"}
              />
            </div>
          </Form.Item>
        </div>
        <div className="flex gap10">
          <p>Reset password</p>
          <Switch
            checked={isResetPassword}
            onChange={(e) => {
              setIsResetPassword(e);
              formik.setFieldValue("password", "");
              formik.setFieldValue("confirm_password", "");
            }}
          />
        </div>

        {isResetPassword && (
          <>
            <div className={styles.inputGroup}>
              <p
                style={{
                  fontWeight: "bold",
                }}
              >
                Password
              </p>
              <Form.Item name="email">
                <div>
                  <Input
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    name="password"
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <p className="error">{formik.errors.password as string}</p>
                  ) : null}
                </div>
              </Form.Item>
            </div>
            <div className={styles.inputGroup}>
              <p
                style={{
                  fontWeight: "bold",
                }}
              >
                Confirm Password
              </p>
              <Form.Item name="email">
                <div>
                  <Input
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.confirm_password}
                    name="confirm_password"
                  />
                  {formik.touched.confirm_password &&
                  formik.errors.confirm_password ? (
                    <p className="error">
                      {formik.errors.confirm_password as string}
                    </p>
                  ) : null}
                </div>
              </Form.Item>
            </div>
          </>
        )}

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
      </div>
    </Modal>
  );
};

export default ModalEditUsers;
