import { useEffect, useMemo, useState } from "react";
import { Typography, Col, Input, Row, Button, Image } from "antd";
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

import { GroupsSVG, LeftArrowSVG, SearchSVG } from "assets/jsx-svg";
import AvatarMain from "assets/images/AvatarMain.png";

import "./styles.css";

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
}) {
  const [productSelected, setProductSelected] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const filterdParticipants = useMemo(
    () =>
      participants?.filter((participant) =>
        participant.name.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [participants, searchValue],
  );

  const onSearch = (e) => {
    let value = e.target.value;

    if (value) {
      setSearchValue(value.trim());
    }
  };

  useEffect(() => {
    if (!!sharedDimId) {
      setActiveBtn("sharingDim");
    }
  }, [setActiveBtn, sharedDimId]);

  return (
    <aside className="h-100">
      <div className="hide-sider clickable" onClick={() => setHideSide(true)}>
        <EyeInvisibleFilled style={{ color: "#8E8E93" }} />
        <Typography.Text className="fw-500 gc">Hide Panel</Typography.Text>
      </div>
      {!productSelected ? (
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

          {activeBtn === "youtubeLink" && (
            <YoutubeLink setActiveBtn={setActiveBtn} fastboard={fastboard} />
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
            <Row gutter={[0, 14]}>
              <Col xs={24}>
                <Typography.Text className="fw-500 fz-18">
                  Participants
                </Typography.Text>
              </Col>
              <Col xs={24}>
                <Input
                  onChange={onSearch}
                  prefix={<SearchSVG />}
                  placeholder="Search"
                  style={{
                    borderRadius: "14px",
                    border: "none",
                    height: "40px",
                  }}
                />
              </Col>
              <Col xs={24}>
                <MeetingCallParticipants participants={filterdParticipants} />
              </Col>
            </Row>
          )}

          {activeBtn === "inventory" && (
            <InventorySection setProductSelected={setProductSelected} />
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
              <div
                className="clickable"
                onClick={() => setActiveBtn("participant")}
              >
                <Row wrap={false} gutter={[6, 0]} align="middle">
                  <Col>
                    <Row align="middle">
                      <LeftArrowSVG
                        color="#8E8E93"
                        style={{ width: "14px", height: "14px" }}
                      />
                    </Row>
                  </Col>
                  <Col>
                    <Typography.Text style={{ color: "#8E8E93" }}>
                      Back
                    </Typography.Text>
                  </Col>
                </Row>
              </div>

              <Row style={{ marginTop: "1rem" }}>
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
                          {joinedSharedDim
                            ? "Leave Dimension"
                            : "Join Dimension"}
                        </Col>
                      </Row>
                    </Button>
                  </Row>
                </Col>
              </Row>
            </>
          )}
        </>
      ) : (
        <ProductSection
          setProductSelected={setProductSelected}
          productSelected={productSelected}
          participants={participants}
        />
      )}
    </aside>
  );
}
