import { Layout, theme, FloatButton } from "antd";
import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { userContext } from "../../Context/userContext";
import SiderMenu from "../../Components/AppLayout/siderMenu";
import SiderBelow from "../../Components/AppLayout/siderBelow";
import SiderLogo from "../../Components/AppLayout/siderLogo";
import AppHeader from "../../Components/AppLayout/Header";
import AuthRoute from "../../authRoute";
import ConfigPanel from "../../Components/AppLayout/ConfigPanel";
const { Content, Footer, Sider } = Layout;
import { FileAddOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { themeContext } from "../../Context/themeContext";
import { NotificationProvider } from "../../Context/notificationContext";

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(themeContext);

  const { token } = theme.useToken();
  const { user } = useContext(userContext);

  return (
    <NotificationProvider>
      <AuthRoute>
        <Layout style={{ height: "100vh" }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme="light"
            width={200}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "16px 0",
              }}
            >
              <SiderLogo collapsed={collapsed} token={token} />
              <SiderMenu />
              <SiderBelow collapsed={collapsed} open={open} setOpen={setOpen} />
            </div>
          </Sider>

          <Layout>
            <AppHeader token={token} user={user} />

            <Content style={{ margin: "0px 16px" }}>
              <Outlet />
            </Content>

            <Footer style={{ textAlign: "center" }}>
              Taskflow ©{new Date().getFullYear()} Gauss
            </Footer>
          </Layout>

          <FloatButton.Group
            trigger="hover"
            type="primary"
            icon={<FileAddOutlined />}
          >
            <FloatButton
              icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
              tooltip="Change Theme"
              onClick={() => setDarkMode((prev) => !prev)}
            />
            <FloatButton tooltip="New Board" icon={<FileAddOutlined />} />
          </FloatButton.Group>

          <ConfigPanel open={open} setOpen={setOpen} />
        </Layout>
      </AuthRoute>
    </NotificationProvider>
  );
};

export default Home;
