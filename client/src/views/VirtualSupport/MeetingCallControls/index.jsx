import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Dropdown,
  Image,
  Menu,
  Modal,
  notification,
  Row,
  Tooltip,
  Typography,
} from "antd";

import {
  ArrowDownSVG,
  BookingsExperienceSVG,
  CallEndSVG,
  DestinationSVG,
  GroupsSVG,
  MuteVoiceSVG,
  NoSoundSVG,
  NoVideoSVG,
  ScreenSVG,
  SettingFillSVG,
  ShareDimenstionSVG,
  SoundSVG,
  VideoSVG,
  VoiceSVG,
} from "assets/jsx-svg";
import MetaverseService from "services/metaverse.service";
import "./styles.css";

export default function MeetingCallControls({
  isHost,
  audioMuted,
  cameraEnabled,
  soundMuted,
  toggleAudioMute,
  toggleVideo,
  toggleSoundMute,
  publishScreen,
  unPublishScreen,
  sharingScreen,
  SystemMessage,
  unPublishDim,
  sharingDim,
  joinedSharedDim,
  setJoinedSharedDim,
  sharedDimId,
  userFullName,
  controlSettingsShow,
  setControlSettingsShow,
}) {
  const [settings, setSettings] = useState([]);
  const [dimModalOpen, setDimModalOpen] = useState(false);
  const [myDims, setMyDims] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const {
          data: {
            data: { rows },
          },
        } = await MetaverseService.getMyDimensions();

        setMyDims(rows);
      } catch (error) {
        console.log("Error fetching my dimensions", error.message);
      }
    })();
  }, []);

  const settingsMenu = useMemo(() => {
    const settingsToggle = (value) => {
      if (settings.includes(value)) {
        setSettings((prev) => [...prev.filter((item) => item !== value)]);
      } else {
        setSettings((prev) => [...prev, value]);
      }
    };

    return (
      <Row justify="center" align="bottom" className="settings-options">
        <Col xs={24} style={{ marginBottom: "0.5rem" }}>
          <Row align="middle">
            <Col xs={24}>
              <Typography.Text className="fw-600 wc">
                Allow Participants to :
              </Typography.Text>
            </Col>
          </Row>
        </Col>
        <Col xs={24} onClick={() => settingsToggle(1)} className="clickable">
          <Row align="middle">
            <Col xs={2}>{settings.includes(1) ? "✔" : ""}</Col>
            <Col xs={22}>Share Screen</Col>
          </Row>
        </Col>
        <Col xs={24} onClick={() => settingsToggle(2)} className="clickable">
          <Row align="middle">
            <Col xs={2}>{settings.includes(2) ? "✔" : ""}</Col>
            <Col xs={22}>Chat</Col>
          </Row>
        </Col>
        <Col xs={24} onClick={() => settingsToggle(3)} className="clickable">
          <Row align="middle">
            <Col xs={2}>{settings.includes(3) ? "✔" : ""}</Col>
            <Col xs={22}>Unmute Themselves</Col>
          </Row>
        </Col>
        <Col xs={24} onClick={() => settingsToggle(4)} className="clickable">
          <Row align="middle">
            <Col xs={2}>{settings.includes(4) ? "✔" : ""}</Col>
            <Col xs={22}>Start Video</Col>
          </Row>
        </Col>
      </Row>
    );
  }, [settings]);

  const endMenu = useMemo(
    () => (
      <Row justify="center" className="settings-options">
        <Col
          xs={24}
          onClick={() => {
            SystemMessage.endMeeting();
            navigate("/meetings");
          }}
        >
          <Button type="ghost" className="w-100 end-meet-btn">
            End Metting for All
          </Button>
        </Col>
        <Col xs={24} onClick={() => navigate("/meetings")}>
          <Button type="ghost" className="w-100 leave-meet-btn">
            Leave Metting
          </Button>
        </Col>
      </Row>
    ),
    [navigate, SystemMessage],
  );

  return (
    <>
      <Row
        align={sharingDim || joinedSharedDim ? "middle" : "bottom"}
        justify="space-between"
        style={{ padding: "10px 14px", position: "relative" }}
      >
        {(sharingDim || joinedSharedDim) && (
          <span
            className="open-settings clickable"
            onClick={() => setControlSettingsShow((prev) => !prev)}
          >
            <ArrowDownSVG
              color="#fff"
              style={{
                width: "14px",
                height: "14px",
                rotate: controlSettingsShow ? "-180deg" : "0deg",
                transition: "all 0.3s ease-in-out",
              }}
            />
          </span>
        )}
        {!!sharedDimId && (
          <Col className="join-dim-btn">
            <Button
              type="primary"
              onClick={() => setJoinedSharedDim(!joinedSharedDim)}
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
          </Col>
        )}

        <Col xs={0} md={3}>
          {!sharingDim && (
            <Typography.Text
              className="fz-12 wc"
              ellipsis
              style={{
                background: "rgba(0, 0, 0, 0.35)",
                borderRadius: "43px",
                padding: "1px 8px",
              }}
            >
              {userFullName}
            </Typography.Text>
          )}
        </Col>

        <Col flex={1}>
          <Row justify="center" align="middle">
            <Tooltip title="Sound on/off">
              <div className="icon-wrapper" onClick={toggleSoundMute}>
                {soundMuted ? (
                  <NoSoundSVG
                    color="#fff"
                    style={{ width: "20px", height: "20px" }}
                  />
                ) : (
                  <SoundSVG
                    color="#fff"
                    style={{ width: "20px", height: "20px" }}
                  />
                )}
              </div>
            </Tooltip>

            <Dropdown
              placement="top"
              trigger={["click"]}
              overlay={
                <Menu
                  className="share-screen-options"
                  items={[
                    {
                      key: "0",
                      label: (
                        <Row justify="center">
                          <Typography.Text className="fz-16 wc w-600">
                            Share
                          </Typography.Text>
                        </Row>
                      ),
                      style: { pointerEvents: "none" },
                    },
                    // {
                    //   key: "1",
                    //   label: (
                    //     <Row
                    //       align="middle"
                    //       gutter={[8, 0]}
                    //       wrap={false}
                    //       onClick={() => {
                    //         if (sharingScreen) unPublishScreen();
                    //         else publishScreen();
                    //       }}
                    //     >
                    //       <Col>
                    //         <Row align="middle">
                    //           <ScreenSVG
                    //             color="#fff"
                    //             style={{ width: "16px", height: "16px" }}
                    //           />
                    //         </Row>
                    //       </Col>
                    //       <Col>
                    //         <Typography.Text className="fz-16 wc fw-300">
                    //           {sharingScreen ? "Stop Screen Share" : "Screen"}
                    //         </Typography.Text>
                    //       </Col>
                    //     </Row>
                    //   ),
                    // },
                    {
                      key: "2",
                      label: (
                        <Row
                          style={{ marginBottom: "8px" }}
                          align="middle"
                          gutter={[8, 0]}
                          wrap={false}
                        >
                          <Col>
                            <Row align="middle">
                              <BookingsExperienceSVG
                                color="#fff"
                                style={{ width: "16px", height: "16px" }}
                              />
                            </Row>
                          </Col>
                          <Col>
                            <Typography.Text className="fz-16 wc fw-300">
                              Bookings Experience
                            </Typography.Text>
                          </Col>
                        </Row>
                      ),
                    },
                    {
                      key: "3",
                      label: (
                        <Row
                          style={{ marginBottom: "8px" }}
                          align="middle"
                          gutter={[8, 0]}
                          wrap={false}
                        >
                          <Col>
                            <Row align="middle">
                              <ShareDimenstionSVG
                                color="#fff"
                                style={{ width: "16px", height: "16px" }}
                              />
                            </Row>
                          </Col>
                          <Col
                            onClick={() => {
                              if (sharingDim) {
                                unPublishDim();
                              } else {
                                if (myDims.length > 0) setDimModalOpen(true);
                                else
                                  notification.warn({
                                    message: "You don't have any dimensions",
                                  });
                              }
                            }}
                          >
                            <Typography.Text className="fz-16 wc fw-300">
                              {sharingDim
                                ? "Stop Dimension Share"
                                : "Metaverse Experience"}
                            </Typography.Text>
                          </Col>
                        </Row>
                      ),
                    },
                    {
                      key: "4",
                      label: (
                        <Row
                          style={{ marginBottom: "8px" }}
                          align="middle"
                          gutter={[8, 0]}
                          wrap={false}
                        >
                          <Col>
                            <Row align="middle">
                              <DestinationSVG
                                color="#fff"
                                style={{ width: "16px", height: "16px" }}
                              />
                            </Row>
                          </Col>
                          <Col>
                            <Typography.Text className="fz-16 wc fw-300">
                              Destination
                            </Typography.Text>
                          </Col>
                        </Row>
                      ),
                    },
                  ]}
                />
              }
            >
              <div
                className="icon-wrapper"
                style={{
                  background:
                    "linear-gradient(270deg, #960BCD 0%, #44C9FF 100%)",
                  opacity: isHost ? "1" : "0.5",
                  pointerEvents: isHost ? "auto" : "none",
                }}
              >
                <ScreenSVG style={{ width: "20px", height: "20px" }} />
              </div>
            </Dropdown>

            <Row
              wrap={false}
              align="middle"
              gutter={[12, 0]}
              className="two-icons"
            >
              <Col>
                <Tooltip title={audioMuted ? "Unmute" : "Mute"}>
                  <div
                    className="center-items clickable"
                    onClick={toggleAudioMute}
                  >
                    {audioMuted ? (
                      <MuteVoiceSVG
                        color="#fff"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : (
                      <VoiceSVG
                        color="#fff"
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                  </div>
                </Tooltip>
              </Col>
              <Col>
                <Tooltip
                  title={!cameraEnabled ? "Turn on Camera" : "Turn off Camera"}
                >
                  <div className="center-items clickable" onClick={toggleVideo}>
                    {!cameraEnabled ? (
                      <NoVideoSVG
                        color="#fff"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : (
                      <VideoSVG
                        color="#fff"
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                  </div>
                </Tooltip>
              </Col>
            </Row>
          </Row>
        </Col>
        <Col xs={0} md={3}>
          <Row justify="end" gutter={[12, 0]} wrap={false}>
            {isHost ? (
              <>
                <Col>
                  <Dropdown
                    placement="top"
                    trigger={["click"]}
                    overlay={settingsMenu}
                  >
                    <div className="icon-wrapper">
                      <SettingFillSVG
                        color="#fff"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </div>
                  </Dropdown>
                </Col>
                <Col>
                  <Dropdown
                    placement="topRight"
                    trigger={["click"]}
                    overlay={endMenu}
                  >
                    <div
                      style={{ marginInlineEnd: "0px", background: "#E81224" }}
                      className="icon-wrapper"
                    >
                      <CallEndSVG />
                    </div>
                  </Dropdown>
                </Col>
              </>
            ) : (
              <div
                style={{ marginInlineEnd: "0px", background: "#E81224" }}
                className="icon-wrapper"
                onClick={() => navigate("/meetings")}
              >
                <CallEndSVG />
              </div>
            )}
          </Row>
        </Col>
      </Row>

      <Row justify="center">
        <Col xs={24} md={0} style={{ marginTop: "24px" }}>
          <Row justify="center" align="middle" gutter={[12, 0]} wrap={false}>
            {isHost ? (
              <>
                <Col>
                  <Dropdown
                    placement="top"
                    trigger={["click"]}
                    overlay={settingsMenu}
                  >
                    <div className="icon-wrapper">
                      <SettingFillSVG
                        color="#fff"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </div>
                  </Dropdown>
                </Col>
                <Col>
                  <Dropdown
                    placement="top"
                    trigger={["click"]}
                    overlay={endMenu}
                  >
                    <div
                      style={{ marginInlineEnd: "0px", background: "#E81224" }}
                      className="icon-wrapper"
                    >
                      <CallEndSVG />
                    </div>
                  </Dropdown>
                </Col>
              </>
            ) : (
              <div
                style={{ marginInlineEnd: "0px", background: "#E81224" }}
                className="icon-wrapper"
                onClick={() => navigate("/meetings")}
              >
                <CallEndSVG />
              </div>
            )}
          </Row>
        </Col>
      </Row>

      {myDims.length > 0 && (
        <Modal
          footer={null}
          closable={false}
          onCancel={() => setDimModalOpen(false)}
          open={dimModalOpen}
          title="Please select a dimension to share"
          centered
          width={500}
        >
          <Row gutter={[10, 10]}>
            {myDims.map((dim) => (
              <Col
                key={dim.id}
                span={8}
                className="meeting-call-main-dim-col"
                onClick={() => {
                  SystemMessage.shareDim(dim.id);
                  setDimModalOpen(false);
                }}
              >
                <Image
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                  src={dim.image}
                  preview={false}
                />

                <Typography className="fz-16">
                  {dim.customerDimensionTranslations[0].name}
                </Typography>
              </Col>
            ))}
          </Row>
        </Modal>
      )}
    </>
  );
}
