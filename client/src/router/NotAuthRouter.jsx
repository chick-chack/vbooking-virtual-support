import { Suspense, lazy, useContext, useEffect } from "react";
import { Routes, Route, useLocation, useSearchParams } from "react-router-dom";
import { Col, Image, Layout, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import axios from "axios";

import ScrollToTop from "components/ScrollToTop";
import userContext from "context/userContext";
import { LoadingOutlined } from "@ant-design/icons";
import logo from "assets/images/logo.png";
import AuthService from "services/auth.service";

const VirtualSupport = lazy(() => import("views/VirtualSupport"));
const LoginView = lazy(() => import("views/Auth"));

const notAuthURL = ["virtual-support"];

export default function NotAuthRouter() {
  const location = useLocation();
  const { setUser } = useContext(userContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    (async () => {
      try {
        if (
          searchParams.get("sid") ===
          "NUqGk1GpRURaFR.3oGm02OkLTL8UbKBARusWlSuN1nggryqkTiF1."
        ) {
          axios.defaults.headers.authorization =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY3VzdG9tZXItd2ViLWRhc2hib2FyZCIsImlkIjo3NzQsImlhdCI6MTY4MTczODk5Mn0.N_yeYhqRg0GjlkS7RJhTlAKp0kchX6GcJxO6hRi3WEQ";
          const {
            data: { data: user },
          } = await AuthService.getAuth();

          setUser(user);
        }
        if (location.pathname.split("/")[1] !== "virtual-support") {
          localStorage.removeItem("vverse-token");
          setUser(null);
        }
        if (
          !location.hash &&
          !notAuthURL.includes(location.pathname.split("/")[1])
        ) {
          window.location.replace("https://www.vbooking.ai/");
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [location.hash, location.pathname, searchParams, setUser]);

  return (
    <Suspense
      fallback={
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
      }
    >
      <Layout>
        <ScrollToTop />

        <Content style={{ background: "#fff" }}>
          <Routes>
            <Route index path="/login" element={<LoginView />} />
            <Route
              path="/virtual-support/:meetingId"
              element={<VirtualSupport />}
            />
          </Routes>
        </Content>
      </Layout>
    </Suspense>
  );
}
