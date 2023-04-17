import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Upload,
  message,
} from "antd";
import userContext from "context/userContext";
import { useContext, useMemo, useState } from "react";
import CommonService from "services/common.service";

export default function CounterForUser({
  SystemMessage,
  setAskedForCounter,
  setActiveBtn,
  counterFormData,
}) {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(userContext);

  const onFinish = (values) => {
    if (counterFormData.type === 1) {
      SystemMessage.changeCounterUserSharedData({
        user: {
          id: user.id,
          fullName: user.fullName,
        },
        fullName: values.fullName,
      });
    } else if (counterFormData.type === 4) {
      SystemMessage.changeCounterUserSharedData({
        user: {
          id: user.id,
          fullName: user.fullName,
        },
        customField: {
          name: counterFormData.customField,
          value: values.customField,
        },
      });
    }
    setAskedForCounter(false);
    setActiveBtn("participant");
  };

  const filesDraggerProps = useMemo(
    () => ({
      name: "file",
      multiple: true,
      action: false,
      beforeUpload: () => false,
      onChange: async (info) => {
        setLoading(true);

        try {
          const {
            uploadedFiles: { file: fileUrl },
          } = await CommonService.uploadFile(info.file);

          const newFile = {
            id: info.file.uid,
            name: info.file.name,
            type: info.file.type,
            url: fileUrl,
            userName: user.fullName,
          };

          SystemMessage.changeCounterUserSharedData({
            user: {
              id: user.id,
              fullName: user.fullName,
            },
            file: newFile,
          });

          message.success({
            content: `Uploaded file: ${info.file.name}`,
          });
        } catch (error) {
          console.warn("Error uploading file: ", error);
          message.error({
            content: `Failed to upload file: ${info.file.name}`,
          });
        } finally {
          setLoading(false);
        }
      },
      showUploadList: false,
    }),
    [SystemMessage, user.fullName, user.id],
  );

  const signatureDraggerProps = useMemo(
    () => ({
      name: "file",
      multiple: false,
      action: false,
      beforeUpload: () => false,
      onChange: async (info) => {
        setLoading(true);

        try {
          const {
            uploadedFiles: { file: fileUrl },
          } = await CommonService.uploadFile(info.file);

          const newFile = {
            id: info.file.uid,
            name: info.file.name,
            type: info.file.type,
            url: fileUrl,
            userName: user.fullName,
          };

          SystemMessage.changeCounterUserSharedData({
            user: {
              id: user.id,
              fullName: user.fullName,
            },
            signature: newFile,
          });

          message.success({
            content: `Uploaded file: ${info.file.name}`,
          });
        } catch (error) {
          console.warn("Error uploading file: ", error);
          message.error({
            content: `Failed to upload file: ${info.file.name}`,
          });
        } finally {
          setLoading(false);
        }
      },
      showUploadList: false,
    }),
    [],
  );

  return (
    <>
      <Typography.Text className="fz-18 fw-500">Counter</Typography.Text>

      <section style={{ marginTop: "24px", height: "calc(100% - 80px" }}>
        <Typography.Text className="fw-500">
          Admin asked you for:
        </Typography.Text>
        <Form
          name="userCounter"
          requiredMark={false}
          layout="vertical"
          onFinish={onFinish}
          className="h-100"
        >
          <Row
            className="h-100"
            justify="space-between"
            style={{ flexDirection: "column" }}
          >
            <Col>
              {counterFormData.type === 1 && (
                <Form.Item
                  rules={[
                    {
                      required: counterFormData.type === 1,
                      message: "Please Enter Your Full Name",
                    },
                  ]}
                  name="fullName"
                  label="Full Name"
                  className="mt-1"
                >
                  <Input placeholder="Enter Your Full Name" />
                </Form.Item>
              )}

              {counterFormData.type === 2 && (
                <Form.Item
                  rules={[
                    {
                      required: counterFormData.type === 2,
                      message: "Please Upload File",
                    },
                  ]}
                  name="signature"
                  label="Signature File"
                  className="mt-1"
                >
                  <Upload.Dragger
                    style={{
                      background: "#fff",
                      borderRadius: "14px",
                      minHeight: "140px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignContent: "center",
                    }}
                    {...signatureDraggerProps}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignContent: "center",
                      }}
                    >
                      <Typography.Text className="fw-500">
                        Upload File
                      </Typography.Text>
                      <Typography.Text className="gc">
                        or drag and drop
                      </Typography.Text>
                    </div>
                  </Upload.Dragger>
                </Form.Item>
              )}

              {counterFormData.type === 3 && (
                <Form.Item
                  rules={[
                    {
                      required: counterFormData.type === 3,
                      message: "Please Upload File",
                    },
                  ]}
                  name="file"
                  label={`${counterFormData.fileName}`}
                  className="mt-1"
                >
                  <Upload.Dragger
                    style={{
                      background: "#fff",
                      borderRadius: "14px",
                      minHeight: "140px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignContent: "center",
                    }}
                    {...filesDraggerProps}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignContent: "center",
                      }}
                    >
                      <Typography.Text className="fw-500">
                        Upload File
                      </Typography.Text>
                      <Typography.Text className="gc">
                        or drag and drop
                      </Typography.Text>
                    </div>
                  </Upload.Dragger>
                </Form.Item>
              )}

              {counterFormData.type === 4 && (
                <Form.Item
                  rules={[
                    {
                      required: counterFormData.type === 3,
                      message: `Please Enter ${counterFormData.customField}`,
                    },
                  ]}
                  name="customField"
                  label={`${counterFormData.customField}`}
                  className="mt-1"
                >
                  <Input placeholder={`Enter ${counterFormData.customField}`} />
                </Form.Item>
              )}
            </Col>
            <Col>
              <Form.Item style={{ marginTop: "4rem" }}>
                <Button
                  loading={loading}
                  className="w-100"
                  type="primary"
                  htmlType="submit"
                >
                  Done
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </section>
    </>
  );
}
