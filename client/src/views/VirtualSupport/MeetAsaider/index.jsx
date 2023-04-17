import { useEffect, useMemo, useState } from "react";
import { Typography, Col, Row, Button, Image, Form } from "antd";
import { EyeInvisibleFilled } from "@ant-design/icons";

import MeetingCallParticipants from "../MeetingCallParticipants";
import InventorySection from "../InventorySection";
import ProductSection from "../ProductSection";
import MeetChat from "../MeetChat";
import MyCart from "../MyCart";
import ShareTools from "../ShareTools";
import MetaExperience from "../MetaExperience";
import Holomeet from "../Holomeet";
import FilesSharing from "../FilesSharing";
import SharedFiles from "../SharedFiles";
import YoutubeLink from "../YoutubeLink";
import Counter from "../Counter";
import CounterParticipants from "../Counter/CounterParticipants";
import ProductionTools from "../ProductionTools";
import LiveStream from "../LiveStream";
import CounterForUser from "../Counter/CounterForUser";

import { GroupsSVG } from "assets/jsx-svg";
import AvatarMain from "assets/images/AvatarMain.png";

import "./styles.css";
import CounterSharedData from "../Counter/CounterSharedData";

export default function MeetAsaider({
  isHost,
  chatLoading,
  messages,
  sendMessage,
  participants,
  setActiveBtn,
  activeBtn,
  SystemMessage,
  shareWhiteboard,
  permissions,
  sharedDimId,
  sharingDimId,
  sharedFiles,
  setSharedFiles,
  sharingScreen,
  unPublishScreen,
  publishScreen,
  sharingDim,
  sharingFile,
  sharingWhiteboard,
  setHideSide,
  joinedSharedDim,
  setJoinedSharedDim,
  fastboard,
  setAskedForCounter,
  counterFormData,
  counterSharedData,
}) {
  const [productSelected, setProductSelected] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [showParticipants, setShowParticipants] = useState(participants);
  const [selectedCam, setSelectedCam] = useState(null);
  const [counterActiveBtn, setCounterActiveBtn] = useState(3);
  const [counterForm] = Form.useForm();

  useMemo(() => {
    if (searchValue) {
      setShowParticipants(
        participants?.filter((participant) =>
          participant.name.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      );
    } else {
      setShowParticipants(participants);
    }
  }, [participants, searchValue]);

  const onSearch = (e) => {
    let value = e.target.value;
    setSearchValue(value.trim());
  };

  useEffect(() => {
    if (!!sharedDimId) {
      setActiveBtn("sharingDim");
    } else {
      setActiveBtn("participant");
    }
  }, [setActiveBtn, sharedDimId]);

  useEffect(() => {
    if (sharingFile && !isHost) {
      setActiveBtn("sharedFiles");
    }
  }, [setActiveBtn, sharingFile, isHost]);

  return (
    <aside className="h-100">
      <div className="hide-sider clickable" onClick={() => setHideSide(true)}>
        <EyeInvisibleFilled style={{ color: "#8E8E93" }} />
        <Typography.Text className="fw-500 gc">Hide Panel</Typography.Text>
      </div>
      <>
        {activeBtn === "metaExperience" && (
          <MetaExperience
            SystemMessage={SystemMessage}
            setActiveBtn={setActiveBtn}
            sharingDimId={sharingDimId}
            sharingScreen={sharingScreen}
            unPublishScreen={unPublishScreen}
            sharingFile={sharingFile}
            sharingWhiteboard={sharingWhiteboard}
          />
        )}

        {activeBtn === "myCart" && <MyCart />}

        {activeBtn === "productSection" && (
          <ProductSection
            setProductSelected={setProductSelected}
            productSelected={productSelected}
            participants={participants}
            setActiveBtn={setActiveBtn}
          />
        )}

        {activeBtn === "youtubeLink" && (
          <YoutubeLink setActiveBtn={setActiveBtn} fastboard={fastboard} />
        )}

        {activeBtn === "counter" && (
          <Counter
            setActiveBtn={setActiveBtn}
            SystemMessage={SystemMessage}
            counterForm={counterForm}
            counterActiveBtn={counterActiveBtn}
            setCounterActiveBtn={setCounterActiveBtn}
            setAskedForCounter={setAskedForCounter}
          />
        )}

        {activeBtn === "userCounter" && (
          <CounterForUser
            SystemMessage={SystemMessage}
            setActiveBtn={setActiveBtn}
            setAskedForCounter={setAskedForCounter}
            counterFormData={counterFormData}
          />
        )}

        {activeBtn === "counterUserSharedData" && (
          <CounterSharedData
            setActiveBtn={setActiveBtn}
            counterSharedData={counterSharedData}
          />
        )}

        {activeBtn === "counterParticipants" && (
          <CounterParticipants
            setActiveBtn={setActiveBtn}
            participants={participants}
            counterForm={counterForm}
            SystemMessage={SystemMessage}
            counterActiveBtn={counterActiveBtn}
            setAskedForCounter={setAskedForCounter}
          />
        )}

        {activeBtn === "productionTools" && (
          <ProductionTools setActiveBtn={setActiveBtn} />
        )}

        {activeBtn === "liveStream" && (
          <LiveStream
            setActiveBtn={setActiveBtn}
            selectedCam={selectedCam}
            setSelectedCam={setSelectedCam}
          />
        )}

        {activeBtn === "tools" && (
          <ShareTools
            setActiveBtn={setActiveBtn}
            shareWhiteboard={shareWhiteboard}
            isHost={isHost}
            permissions={permissions}
            sharingScreen={sharingScreen}
            unPublishScreen={unPublishScreen}
            publishScreen={publishScreen}
            SystemMessage={SystemMessage}
            sharingDim={sharingDim}
            sharingFile={sharingFile}
            sharingWhiteboard={sharingWhiteboard}
          />
        )}

        {activeBtn === "participant" && (
          <MeetingCallParticipants
            participants={showParticipants}
            onSearch={onSearch}
          />
        )}

        {activeBtn === "inventory" && (
          <InventorySection
            setProductSelected={setProductSelected}
            setActiveBtn={setActiveBtn}
          />
        )}

        {activeBtn === "chat" && (
          <Row gutter={[0, 14]} className="h-100">
            <Col xs={24}>
              <MeetChat
                loading={chatLoading}
                messages={messages}
                sendMessage={sendMessage}
                participants={participants}
                isHost={isHost}
                permissions={permissions}
              />
            </Col>
          </Row>
        )}

        {activeBtn === "holomeet" && <Holomeet />}

        {activeBtn === "files" && (
          <FilesSharing
            setActiveBtn={setActiveBtn}
            sharedFiles={sharedFiles}
            setSharedFiles={setSharedFiles}
          />
        )}

        {activeBtn === "sharedFiles" && (
          <SharedFiles
            setActiveBtn={setActiveBtn}
            sharedFiles={sharedFiles}
            permissions={permissions}
          />
        )}

        {activeBtn === "sharingDim" && (
          <>
            <Row style={{ marginTop: "24px" }}>
              <Typography.Text className="fz-18 fw-400">
                You Can Join Metaverse Experience With Other Participants.
              </Typography.Text>
            </Row>
            <Row
              justify="center"
              gutter={[0, 16]}
              style={{ marginTop: "160px" }}
            >
              <Col xs={24}>
                <Row justify="center">
                  <Image src={AvatarMain} preview={false} alt="Main avatar" />
                </Row>
              </Col>
              <Col className="join-dim-btn" xs={24}>
                <Row justify="center">
                  <Button
                    onClick={() => setJoinedSharedDim(!joinedSharedDim)}
                    type="primary"
                    style={{ borderRadius: "14px" }}
                  >
                    <Row gutter={[6, 0]} wrap={false} align="middle">
                      <Col>
                        <Row align="middle">
                          <GroupsSVG />
                        </Row>
                      </Col>
                      <Col>
                        {joinedSharedDim ? "Leave Dimension" : "Join Dimension"}
                      </Col>
                    </Row>
                  </Button>
                </Row>
              </Col>
            </Row>
          </>
        )}
      </>
    </aside>
  );
}
