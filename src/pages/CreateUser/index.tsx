/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { UserRolesEnum } from "@constants/userRoles";
import { UsersService } from "@services/users.service";
import { Col, Form, Input, Row, Select, message } from "antd";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import styles from "./index.module.scss";
export default function CreateUser() {
  const navigate = useNavigate();
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
      password: Yup.string()
        .required("Password is required!")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()])(?=.{8,})/,
          "Password must contain at least 8 characters, one uppercase, one number and one special case character (!@#$%^&*)"
        ),
      confirm_password: Yup.string()
        .required("Confirm password is required!")
        // @ts-ignore
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),

    onSubmit: async (values: any) => {
      try {
        const user = {
          ...values,
        };
        delete user.confirm_password;

        await UsersService.createUsers(user);
        void message.success("Create user successfully!");
      } catch (error) {
        console.log(error);
        // @ts-ignore
        void message.error(error?.message || "Something went wrong!");
      } finally {
        navigate("/users");
        formik.resetForm();
      }
    },
  });

  return (
    <div className={styles.wrapper}>
      <div className="flex justifyBetween alignCenter">
        <h1>Add New User</h1>
        <div className="flex gap10">
          <button
            className="secondaryBtn"
            onClick={() => {
              navigate("/users");
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
      <div className={styles.contentCreate}>
        <Row gutter={20}>
          <Col xs={24} lg={12}>
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
                      .filter((item) => item !== UserRolesEnum.ADMIN)
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
          </Col>
          <Col xs={24} lg={12}>
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
          </Col>
        </Row>
      </div>
    </div>
  );
}
