import { useEffect, useState } from "react";
import { Col, Image, Row, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";

import VverseRouter from "router";
import NotAuthRouter from "router/NotAuthRouter";

import UserContext from "context/userContext";
import AuthService from "services/auth.service";

import logo from "assets/images/logo.png";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const offlineListener = window.addEventListener("offline", () => {
      notification.error({ message: "You lost your internet connection!" });
    });
    const onlineListener = window.addEventListener("online", () => {
      notification.success({
        message: "Your connection have been restored!",
      });
    });

    let onClosePageListener;
    if (user?.isGuest) {
      onClosePageListener = window.addEventListener("beforeunload", (event) => {
        event.preventDefault();
        localStorage.removeItem("vverse-token");
        setUser(null);
        event.returnValue = "";
      });
    }

    return () => {
      window.removeEventListener("offline", offlineListener);
      window.removeEventListener("online", onlineListener);
      window.removeEventListener("beforeunload", onClosePageListener);
    };
  }, [user?.isGuest]);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { data: user },
        } = await AuthService.getAuth();

        localStorage.setItem(
          "vverse-token",
          user.customerWebDashboardAccessToken,
        );
        setUser(user);
        axios.defaults.headers.authorization =
          user.customerWebDashboardAccessToken;
      } catch (ignored) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return loading ? (
    <div
      style={{ width: "100vw", height: "100vh", background: "#fff" }}
      className="center-items"
    >
      <Row gutter={[0, 30]}>
        <Col xs={24}>
          <Row justify={"center"}>
            <Image preview={false} src={logo} alt="vbooling Logo" />
          </Row>
        </Col>
        <Col xs={24}>
          <Row justify={"center"}>
            <LoadingOutlined />
          </Row>
        </Col>
      </Row>
    </div>
  ) : (
    <UserContext.Provider value={{ user, setUser }}>
      {user ? (
        !user.isGuest ? (
          <VverseRouter />
        ) : (
          <NotAuthRouter />
        )
      ) : (
        <NotAuthRouter />
      )}
    </UserContext.Provider>
  );
}

export default App;
