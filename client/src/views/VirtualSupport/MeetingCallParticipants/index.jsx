import { Avatar, Col, Input, Row, Typography } from "antd";
import profileImg from "assets/images/avatar.png";
import {
  MuteVoiceSVG,
  NoVideoSVG,
  SearchSVG,
  VideoSVG,
  VoiceSVG,
} from "assets/jsx-svg";

import "./styles.css";

export default function MeetingCallParticipants({ participants, onSearch }) {
  return (
    <>
      <Typography.Text className="fw-500 fz-18">Participants</Typography.Text>

      <Row gutter={[0, 14]} style={{ marginTop: "24px" }}>
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
          <Row className="support-participants" gutter={[0, 12]}>
            {participants?.map((participant) => (
              <Col key={participant.uid} xs={24}>
                <Row
                  justify="space-between"
                  align="middle"
                  wrap={false}
                  style={{
                    padding: "8px 12px",
                    background: participant.isHost && "#fff",
                    borderRadius: "32px",
                  }}
                >
                  <Col flex={1}>
                    <Row align="middle" wrap={false}>
                      <Avatar
                        style={{ objectFit: "cover" }}
                        src={participant.profileImage || profileImg}
                        size={35}
                      />

                      <Typography.Text
                        ellipsis
                        style={{
                          marginInlineStart: "0.5rem",
                          color: "#888888",
                        }}
                        className="fz-12"
                      >
                        {participant.name}
                      </Typography.Text>
                    </Row>
                  </Col>
                  <Col>
                    <Row
                      align="middle"
                      className="participant-status"
                      wrap={false}
                    >
                      {participant.isHost && (
                        <span
                          style={{
                            color: "#93C850",
                            fontSize: "12px",
                            marginInlineEnd: "8px",
                          }}
                        >
                          Host
                        </span>
                      )}
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
        </Col>
      </Row>
    </>
  );
}
