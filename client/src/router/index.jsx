import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";

import ScrollToTop from "components/ScrollToTop";
import {
  BookingExperience,
  DestinationsPreview,
  VirtualSupportView,
} from "views";
import HotelDetails from "views/HotelDetails";
import { AgoraChatContextProvider } from "hooks/useAgoraChat";

export default function VverseRouter() {
  return (
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

            <Route path="/hotel-details/:hotelId" element={<HotelDetails />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Content>
      </Layout>
    </AgoraChatContextProvider>
  );
}
