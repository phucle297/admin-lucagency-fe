import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import logo from "@images/logo.png";
import { Form, Input, message } from "antd";
import { LocalStorageKeys } from "@constants/localStorageKeys";
import { useFormik } from "formik";
import { useState } from "react";
import { AuthService } from "@services/auth.service";
import * as Yup from "yup";
import styles from "./index.module.scss";
import { UserRolesEnum } from "@constants/userRoles";

export default function Login() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Required").email("Invalid email"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await AuthService.login({ ...values });
        if (res.status === 200) {
          message.success("Login successfully");
          localStorage.setItem(LocalStorageKeys.TOKEN, res?.data?.access_token);
          if (res.data?.user?.role === UserRolesEnum.SALE) {
            window.location.href = "/customers";
          } else {
            window.location.href = "/posts";
          }
        } else {
          message.error("Login failed, please try again");
        }
      } catch (error) {
        console.log(error);
        message.error("Login failed, please try again");
      }
    },
  });
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
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
                <p className={"error"}>{formik.errors.email}</p>
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
            Password
          </p>
          <Form.Item name="password">
            <div>
              <div className={styles.password}>
                <Input
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                />

                <div
                  className={styles.passwordIcon}
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </div>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <p className={"error"}>{formik.errors.password}</p>
              ) : null}
            </div>
          </Form.Item>
        </div>

        <button
          className="primaryBtn"
          onClick={() => {
            formik.handleSubmit();
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
