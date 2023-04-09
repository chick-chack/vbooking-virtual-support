import { Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

import ScrollToTop from "components/ScrollToTop";
import { LoginView } from "views";

export default function NotAuthRouter() {
  return (
    <Layout>
      <ScrollToTop />

      <Content style={{ background: "#fff" }}>
        <Routes>
          <Route index path="/login" element={<LoginView />} />
        </Routes>
      </Content>
    </Layout>
  );
}
