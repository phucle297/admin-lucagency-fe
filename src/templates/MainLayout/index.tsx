/* eslint-disable react-hooks/exhaustive-deps */
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useWidth } from "@hooks/useWidth";
import avatar from "@images/avatar.png";
import logo from "@images/logo.png";
import sidebar1 from "@images/sidebar1.png";
import sidebar3 from "@images/sidebar3.png";
import sidebar4 from "@images/sidebar4.png";
import sidebar5 from "@images/sidebar5.png";
import sidebar6 from "@images/sidebar6.png";
import sidebar7 from "@images/sidebar7.png";
import { AuthService } from "@services/auth.service";
import type { MenuProps } from "antd";
import { Button, Dropdown, Layout, Menu } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useGlobalStore } from "@stores/globalStore";
import { UserRolesEnum, UserRolesText } from "@constants/userRoles";

export default function MainLayout() {
  const whoAmI = useGlobalStore((state) => state.whoAmI);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const width = useWidth();
  const checkDisabled = (key: string) => {
    if (whoAmI?.role === UserRolesEnum.ADMIN) {
      return false;
    }
    if (whoAmI?.role === UserRolesEnum.SEO) {
      if (key === "posts") return false;
      return true;
    }
    if (whoAmI?.role === UserRolesEnum.SALE) {
      if (key === "customers" || key === "invoices") return false;
      return true;
    }
    if (whoAmI?.role === UserRolesEnum.ACCOUNT_EXECUTIVES) {
      if (key === "contacts" || key === "users") return true;
      return false;
    }
    return true;
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <p
          onClick={() => {
            AuthService.logout();
            navigate("/login");
          }}
        >
          Sign out
        </p>
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
          position: "sticky",
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
          onClick={({ key }) => {
            setSelectedKeys([key]);
            navigate(`/${key}`);
          }}
          items={[
            {
              key: "posts",
              icon: <img className={styles.img} src={sidebar1} alt="posts" />,
              label: "Posts",
              disabled: checkDisabled("posts"),
            },
            {
              key: "contacts",
              icon: (
                <img className={styles.img} src={sidebar3} alt="contacts" />
              ),
              label: "Contacts",
              disabled: checkDisabled("contacts"),
            },
            {
              key: "pricing",
              icon: <img className={styles.img} src={sidebar4} alt="pricing" />,
              label: "Pricing",
              disabled: checkDisabled("pricing"),
            },
            {
              key: "invoices",
              icon: (
                <img
                  className={`${styles.img} ${styles.imgInvoice}`}
                  src={sidebar5}
                  alt="invoices"
                />
              ),
              label: "Invoice",
              disabled: checkDisabled("invoices"),
            },
            {
              key: "customers",
              icon: (
                <img className={styles.img} src={sidebar6} alt="customers" />
              ),
              label: "Customers",
              disabled: checkDisabled("invoices"),
            },
            {
              key: "users",
              icon: <img className={styles.img} src={sidebar7} alt="users" />,
              label: "Users",
              disabled: checkDisabled("users"),
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
                  <h3 className={styles.name}>{whoAmI?.name}</h3>
                  <small className={"fade"}>
                    {
                      UserRolesText[
                        whoAmI?.role?.toUpperCase() as keyof typeof UserRolesText
                      ]
                    }
                  </small>
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
