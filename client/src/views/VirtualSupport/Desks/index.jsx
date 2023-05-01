import { useEffect, useState } from "react";
import { Button, Col, Row, Typography } from "antd";

import DeskService from "services/desk.service";
import { LoadingOutlined } from "@ant-design/icons";

import "./styles.css";
import { useNavigate } from "react-router-dom";

export default function Desks() {
  const navigate = useNavigate();
  const [desksData, setDesksData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await DeskService.getMyDesks();
        setDesksData(res.data.data);
      } catch (axiosCatch) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Typography.Text className="fz-18 fw-500">My Desks</Typography.Text>
      <section className="virtual-support-desks">
        {loading ? (
          <Row justify="center">
            <LoadingOutlined />
          </Row>
        ) : (
          desksData?.map((dim) => (
            <Row className="dim-info" id={dim.id} justify="start">
              <Typography.Text className="fz-18 fw-500">
                {dim.name} Desks :
              </Typography.Text>

              {dim.dimensionDesks.map((desk) => (
                <div className="desk-info">
                  <Row align="middle" justify="space-between">
                    <Col>
                      <Row>
                        <Typography.Text className="fw-500">
                          {desk.name}
                        </Typography.Text>
                      </Row>
                      <Row>
                        <Typography.Text>{desk.status}</Typography.Text>
                      </Row>
                    </Col>
                    <Col>
                      <Button
                        type="primary"
                        className="fz-14"
                        style={{ height: "30px", padding: "0 10px" }}
                        onClick={() => {
                          navigate(`/vindo-desk/${desk.meetingId}?type=desk`);
                          window.location.reload(false);
                        }}
                      >
                        Set
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </Row>
          ))
        )}
      </section>
    </>
  );
}
