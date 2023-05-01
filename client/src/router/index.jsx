import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Col, Image, Layout, Row } from "antd";
import { Content } from "antd/lib/layout/layout";
import { LoadingOutlined } from "@ant-design/icons";

import { AgoraChatContextProvider } from "hooks/useAgoraChat";
import ScrollToTop from "components/ScrollToTop";
import HotelDetails from "views/HotelDetails";
import logo from "assets/images/logo.png";

const BookingExperience = lazy(() => import("views/BookingExperience"));
const DestinationsPreview = lazy(() => import("views/DestinationsPreview"));
const VirtualSupportView = lazy(() => import("views/VirtualSupport"));

export default function VverseRouter() {
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
      <AgoraChatContextProvider>
        <Layout>
          <ScrollToTop />

          <Content
            className={"vverse-content-layout"}
            style={{ background: "#fff" }}
          >
            <Routes>
              <Route
                index
                element={
                  <BookingExperience
                    header={`Explore V Booking`}
                    description={`The first travel platform utilizing 
                metaverse technologies offering advanced tools for 
                customers to virtually visit destinations, hotels, 
                and other travel services before booking.`}
                  />
                }
              />

              <Route
                path="/explore-destinations"
                element={
                  <BookingExperience
                    header={`Explore Destinations`}
                    description={`The best travel agency USA, 
                we hold long standing and robust trade relationships 
                with all major airlines, airfare consolidators.`}
                    search
                  />
                }
              />
              <Route
                path="/destination-preview"
                element={<DestinationsPreview />}
              />

              <Route
                path="/virtual-support/:meetingId"
                element={<VirtualSupportView />}
              />

              <Route
                path="/vindo-desk/:meetingId"
                element={<VirtualSupportView />}
              />

              <Route
                path="/hotel-details/:hotelId"
                element={<HotelDetails />}
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Content>
        </Layout>
      </AgoraChatContextProvider>
    </Suspense>
  );
}
