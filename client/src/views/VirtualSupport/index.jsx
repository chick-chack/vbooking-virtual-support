import { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Form,
  Image,
  Row,
  Select,
  Tooltip,
  Typography,
} from "antd";
import AgoraRTC from "agora-rtc-sdk-ng";

import userContext from "context/userContext";
import {
  VoiceSVG,
  MuteVoiceSVG,
  VideoSVG,
  NoVideoSVG,
  ArrowDownSVG,
} from "assets/jsx-svg";
import joinBg from "assets/images/startMeetBg.png";
import DragContext from "./DragContext";
import VirtualSupportView from "./VirtualSupportView";
import "./styles.css";

export default function UserInteractionHOC() {
  const { user } = useContext(userContext);
  const [interacted, setInteracted] = useState(false);
  const [mics, setMics] = useState([]);
  const [cams, setCams] = useState([]);
  const [playbackDevices, setPlaybackDevices] = useState([]);
  const [selectedMic, setSelectedMic] = useState(undefined);
  const [selectedCam, setSelectedCam] = useState(undefined);
  const [selectedPlaybackDevice, setSelectedPlaybackDevice] =
    useState(undefined);
  const [micMuted, setMicMuted] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [settingsActive, setSettingsActive] = useState(false);
  const [dragData, setDragData] = useState({
    dragging: false,
    dropText: "",
    dimId: null,
    file: null,
  });

  const [form] = Form.useForm();

  const onFinish = useCallback((values) => {
    setSelectedMic(values.audioInput);
    setSelectedCam(values.cameraInput);
    setSelectedPlaybackDevice(values.soundOutput);
    setInteracted(true);
  }, []);

  useEffect(() => {
    (async () => {
      let mics = [],
        cams = [],
        playbackDevices = [];

      try {
        mics = await AgoraRTC.getMicrophones(false);
      } catch (ignored) {}

      try {
        cams = await AgoraRTC.getCameras(false);
      } catch (ignored) {}

      try {
        playbackDevices = await AgoraRTC.getPlaybackDevices(false);
      } catch (ignored) {}

      setMics(mics);
      setCams(cams);
      setPlaybackDevices(playbackDevices);
      form.setFieldsValue({
        audioInput: mics[0]?.deviceId,
        cameraInput: cams[0]?.deviceId,
        soundOutput: playbackDevices[0]?.deviceId,
      });
    })();
  }, [form]);

  if (!interacted && user) {
    return (
      <main className="join-meet" style={{ background: `url(${joinBg})` }}>
        <div className="blur">
          <div className="join-meet-main">
            <Row gutter={[0, 16]}>
              <Col xs={24}>
                <Row justify="center">
                  <Image
                    preview={false}
                    alt="defaultUser"
                    src={user.profileImage}
                    className="join-meet-img"
                  />
                </Row>
              </Col>

              <Col xs={24}>
                <Row justify="center">
                  <Typography.Text className="wc fw-500">
                    {user.fullName}
                  </Typography.Text>
                </Row>
              </Col>
              <Col xs={24}>
                <Row align="middle" justify="center" gutter={[16, 16]}>
                  <Col>
                    <Tooltip title={micMuted ? "Unmute" : "Mute"}>
                      <div
                        className="icon-wrapper"
                        onClick={
                          mics.length ? () => setMicMuted(!micMuted) : (_) => _
                        }
                      >
                        {micMuted || !mics.length ? (
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
                      title={!camActive ? "Enable Camera" : "Disable Camera"}
                    >
                      <div
                        className="icon-wrapper"
                        onClick={
                          cams.length
                            ? () => setCamActive(!camActive)
                            : (_) => _
                        }
                      >
                        {!camActive || !cams.length ? (
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
              </Col>

              <Col xs={24}>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#fff",
                      colorPrimaryText: "#fff",
                      borderRadius: "14px",
                      colorBorder: "#fff",
                      colorText: "#fff",
                      colorTextPlaceholder: "#fff",
                    },
                    components: {
                      Select: {
                        colorBgBase: "black",
                        colorBgContainer: "transparent",
                        borderRadius: "14px",
                        controlHeight: "50px",
                        colorBgElevated: "#fff",
                        lineHeight: "50px",
                        colorTextQuaternary: "#fff",
                        colorText: "#000",
                        colorInfoActive: "#fff",
                        paddingXXS: "6px",
                      },
                    },
                  }}
                >
                  <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                    className="join-meet-form"
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: settingsActive
                          ? "flex-start"
                          : "center",
                        alignItems: "center",
                        columnGap: "6px",
                      }}
                    >
                      <div
                        className="device-settings clickable"
                        style={{
                          marginBottom: settingsActive ? "0.3rem" : "0",
                        }}
                        onClick={() => {
                          if (settingsActive) {
                            const settingsEl =
                              document.getElementById("settingsSelect");

                            settingsEl.classList.add("settings-close");
                            setTimeout(() => {
                              settingsEl.classList.remove("settings-close");
                              setSettingsActive((prev) => !prev);
                            }, 300);
                          } else {
                            setSettingsActive((prev) => !prev);
                          }
                        }}
                      >
                        <Typography.Text className="fw-500">
                          Device Settings
                        </Typography.Text>

                        <ArrowDownSVG
                          color="#fff"
                          style={{
                            width: "10px",
                            height: "10px",
                            rotate: settingsActive ? "180deg" : "0deg",
                            transition: "all 0.4s ease-in-out",
                          }}
                        />
                      </div>
                    </div>
                    <div id="settingsSelect">
                      {settingsActive && (
                        <div className="settings-select">
                          <Form.Item label="Audio Input" name="audioInput">
                            <Select
                              options={mics.map((mic) => ({
                                value: mic.deviceId,
                                label: mic.label,
                              }))}
                              placeholder="Select audio input"
                            />
                          </Form.Item>

                          <Form.Item label="Camera Input" name="cameraInput">
                            <Select
                              options={cams.map((cam) => ({
                                value: cam.deviceId,
                                label: cam.label,
                              }))}
                              placeholder="Select camera input"
                            />
                          </Form.Item>

                          <Form.Item label="Sound Output" name="soundOutput">
                            <Select
                              options={playbackDevices.map((device) => ({
                                value: device.deviceId,
                                label: device.label,
                              }))}
                              placeholder="Select sound input"
                            />
                          </Form.Item>
                        </div>
                      )}
                    </div>

                    <Form.Item>
                      <Row justify="center">
                        <Button
                          htmlType="submit"
                          type="primary"
                          style={{
                            borderRadius: "32px",
                            paddingInline: "1.5rem",
                          }}
                          className="join-meet-btn"
                        >
                          Join Meeting
                        </Button>
                      </Row>
                    </Form.Item>
                  </Form>
                </ConfigProvider>
              </Col>
            </Row>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <DragContext.Provider value={{ dragData, setDragData }}>
        <VirtualSupportView
          micId={selectedMic}
          camId={selectedCam}
          playbackDeviceId={selectedPlaybackDevice}
          startMicMuted={micMuted}
          startCamActive={camActive}
        />
      </DragContext.Provider>
    );
  }
}
