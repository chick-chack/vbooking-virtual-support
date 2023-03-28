import { Col, Image, Row, Typography } from "antd";
import profileImg from "assets/images/avatar.png";
import {
  AdminSVG,
  MuteVoiceSVG,
  NoVideoSVG,
  VideoSVG,
  VoiceSVG,
} from "assets/jsx-svg";

import "./styles.css";

export default function MeetingCallParticipants({ participants }) {
  return (
    <Row className="support-participants" gutter={[0, 12]}>
      {participants?.map((participant) => (
        <Col key={participant.uid} xs={24}>
          <Row justify="space-between" align="middle" wrap={false}>
            <Col flex={1}>
              <Row align="middle" wrap={false}>
                <Image
                  style={{ borderRadius: "50%" }}
                  preview={false}
                  alt="profile pic"
                  src={participant.profileImage || profileImg}
                  width={30}
                  height={30}
                />

                <Typography.Text
                  ellipsis
                  style={{ marginInlineStart: "0.5rem", color: "#888888" }}
                  className="fz-12"
                >
                  {participant.name}{" "}
                  {participant.isHost && (
                    <span style={{ color: "#BDBDBD", fontSize: "10px" }}>
                      (<AdminSVG /> Host)
                    </span>
                  )}
                </Typography.Text>
              </Row>
            </Col>
            <Col>
              <Row align="middle" className="participant-status" wrap={false}>
                {participant.hasAudio && (
                  <VoiceSVG
                    color={participant.talking ? "#93C850" : "#A5A299"}
                    style={{ width: "18px", height: "18px" }}
                  />
                )}
                {!participant.hasAudio && (
                  <MuteVoiceSVG
                    color="#BDBDBD"
                    style={{ width: "18px", height: "18px" }}
                  />
                )}
                {participant.hasVideo && (
                  <VideoSVG
                    color="#A5A299"
                    style={{ width: "18px", height: "18px" }}
                  />
                )}
                {!participant.hasVideo && (
                  <NoVideoSVG
                    color="#BDBDBD"
                    style={{ width: "18px", height: "18px" }}
                  />
                )}
              </Row>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
}
