/* eslint-disable react-hooks/exhaustive-deps */
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import avatar from "@images/avatar.png";
import logo from "@images/logo.png";
import sidebar1 from "@images/sidebar1.png";
import sidebar2 from "@images/sidebar2.png";
import sidebar3 from "@images/sidebar3.png";
import sidebar4 from "@images/sidebar4.png";
import sidebar5 from "@images/sidebar5.png";
import sidebar6 from "@images/sidebar6.png";
import sidebar7 from "@images/sidebar7.png";
import type { MenuProps } from "antd";
import { Button, Dropdown, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useWidth } from "hooks/useWidth";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const width = useWidth();
  const items: MenuProps["items"] = [
    {
      label: (
        <span
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Sign out
        </span>
      ),
      key: "signout",
    },
  ];
  useEffect(() => {
    const pathname = location.pathname;
    const key = pathname.split("/")[1];
    setSelectedKeys([key]);
  }, [location.pathname]);
  return (
    <Layout hasSider className={styles.wrapper}>
      <Layout.Sider
        breakpoint="lg"
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: "100vh",
          position: "static",
          left: 0,
          top: 0,
          bottom: 0,
        }}
        width={collapsed ? 80 : width >= 1440 ? 300 : 200}
      >
        <div className={collapsed ? styles.logoCollapsed : styles.logo}>
          <img src={logo} alt="logo" />
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          onSelect={({ key }) => {
            setSelectedKeys([key]);
            navigate(`/${key}`);
          }}
          items={[
            {
              key: "posts",
              icon: <img className={styles.img} src={sidebar1} alt="posts" />,
              label: "Posts",
            },
            {
              key: "pages",
              icon: <img className={styles.img} src={sidebar2} alt="pages" />,
              label: "Pages",
            },
            {
              key: "contacts",
              icon: (
                <img className={styles.img} src={sidebar3} alt="contacts" />
              ),
              label: "Contacts",
            },
            {
              key: "pricing",
              icon: <img className={styles.img} src={sidebar4} alt="pricing" />,
              label: "Pricing",
            },
            {
              key: "invoice",
              icon: (
                <img
                  className={`${styles.img} ${styles.imgInvoice}`}
                  src={sidebar5}
                  alt="invoice"
                />
              ),
              label: "Invoice",
            },
            {
              key: "customers",
              icon: (
                <img className={styles.img} src={sidebar6} alt="customers" />
              ),
              label: "Customers",
            },
            {
              key: "users",
              icon: <img className={styles.img} src={sidebar7} alt="users" />,
              label: "Users",
            },
          ]}
        />
        <Button
          onClick={() => {
            setCollapsed(!collapsed);
          }}
          className={styles.triggerBtn}
        >
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </Button>

        <Dropdown menu={{ items }} trigger={["click"]}>
          <div className={styles.footer}>
            <div className={styles.avatar}>
              <img src={avatar} alt="avatar" />
            </div>
            {!collapsed && (
              <>
                <div className={styles.info}>
                  <h3 className={styles.name}>John Doe</h3>
                  <small className={"fade"}>Administrator</small>
                </div>
              </>
            )}
          </div>
        </Dropdown>
      </Layout.Sider>
      <Layout className={styles.content}>
        <Outlet />
      </Layout>
    </Layout>
  );
}
