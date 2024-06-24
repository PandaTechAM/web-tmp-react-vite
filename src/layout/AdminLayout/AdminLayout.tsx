import React, { useState } from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, Button } from "antd";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
import { useToken } from "hooks/useToken";

const { Header, Content, Sider } = Layout;

const items: MenuProps["items"] = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const AdminLayout: React.FC = () => {
  const token = useToken();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout hasSider>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: token.fullHeight,
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: token.colorWhite,
        }}
      >
        <div
          style={{
            padding: 17,
          }}
        >
          <img
            width={30}
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            alt="logo"
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={items}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: !collapsed ? 200 : 80,
          transition: "all 0.1s ease-in-out",
        }}
      >
        <Header
          className={styles.header}
          style={{
            width: `calc(100% - ${collapsed ? 80 : 200}px)`,
          }}
        />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: "lightgray",
              borderRadius: token.borderRadiusLG,
            }}
          >
            <Button type="primary">
              <span>Button</span>
            </Button>
            <Outlet />
          </div>
          {/* <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <p>long content</p>
            {
              // indicates very long content
              Array.from({ length: 100 }, (_, index) => (
                <React.Fragment key={index}>
                  {index % 20 === 0 && index ? "more" : "..."}
                  <br />
                </React.Fragment>
              ))
            }
          </div> */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
