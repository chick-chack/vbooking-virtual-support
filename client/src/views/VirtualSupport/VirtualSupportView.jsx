import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Col,
  Dropdown,
  Image,
  Menu,
  message,
  Modal,
  notification,
  Row,
  Tooltip,
  Typography,
} from "antd";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraChat from "agora-chat";

import userContext from "context/userContext";
import SocialEventService from "services/social-event.service";
import CommonService from "services/common.service";
import CustomSlider from "components/CustomSlider";
import logo from "assets/images/logo.png";
import hologram from "assets/images/3d-hologram.png";
import {
  ParticipantsSVG,
  PackageSVG,
  ShoppingCartSVG,
  LinkSVG,
  AddUserSVG,
  SMSSVG,
} from "assets/jsx-svg";
import MeetingScreen from "./MeetingScreen";
import MeetAsaider from "./MeetAsaider";
import "./styles.css";
import InviteFriends from "./InviteFriends";
import Holomeet from "./Holomeet";
import { LoadingOutlined } from "@ant-design/icons";

const inviteMenu = (
  <Menu
    items={[
      {
        key: "1",
        label: (
          <Row align="middle" gutter={[6, 0]}>
            <Col>
              <Row align="middle">
                <LinkSVG
                  color="#fff"
                  style={{ width: "11px", height: "11px" }}
                />
              </Row>
            </Col>
            <Col>
              <Typography.Text className="fz-14 fw-400 wc">
                Copy Meeting URL
              </Typography.Text>
            </Col>
          </Row>
        ),
        onClick: () => {
          message.info("Meeting URL Copied");
          navigator.clipboard.writeText(window.location.href);
        },
      },
      {
        key: "2",
        label: (
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            dropdownRender={() => <InviteFriends />}
            destroyPopupOnHide
            getPopupContainer={() =>
              document.getElementById("inviteParticipants")
            }
          >
            <Row align="middle" gutter={[6, 0]}>
              <Col>
                <Row align="middle">
                  <AddUserSVG style={{ width: "14px", height: "14px" }} />
                </Row>
              </Col>
              <Col>
                <Typography.Text className="fz-14 fw-400 wc">
                  Invite Friend
                </Typography.Text>
              </Col>
            </Row>
          </Dropdown>
        ),
        className: "fz-14 fw-400 wc",
      },
    ]}
    style={{
      background: "rgba(0, 0, 0, 0.4)",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(10px)",
      color: "#fff",
    }}
  />
);

const formatSystemMsg = (msg) => `SYSTEM_${msg}_SYSTEM`;
const isSystemMsg = (msg) => /^SYSTEM_[\s\S]*_SYSTEM$/.test(msg);

export default function VirtualSupportView({
  micId,
  camId,
  playbackDeviceId,
  startMicMuted,
  startCamActive,
}) {
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeBtn, setActiveBtn] = useState("participant");
  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localScreenTrack, setLocalScreenTrack] = useState(null);
  const [soundMuted, setSoundMuted] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [mainScreenId, setMainScreenId] = useState(null);
  const [sharingDimId, setSharingDimId] = useState(null);
  const [sharedDimId, setSharedDimId] = useState(null);
  const [joinedSharedDim, setJoinedSharedDim] = useState(false);
  const [talking, setTalking] = useState(false);
  const [hideSider, setHideSider] = useState(false);
  const [holoModalOpen, setHoloModalOpen] = useState(false);
  const { user } = useContext(userContext);
  const joinTriesRef = useRef(1);
  const soundMutedRef = useRef();
  const { meetingId } = useParams();
  const navigate = useNavigate();

  const slideResponsive = useMemo(
    () => [
      {
        breakpoint: 3000,
        settings: {
          slidesToShow: hideSider ? 5 : 4,
          slidesToScroll: hideSider ? 5 : 4,
        },
      },
      {
        breakpoint: 1480,
        settings: {
          slidesToShow: hideSider ? 4 : 3,
          slidesToScroll: hideSider ? 4 : 3,
        },
      },
      {
        breakpoint: 1120,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
    [hideSider],
  );

  const myUidRef = useRef(user?.id);
  const micIdRef = useRef(micId);
  const camIdRef = useRef(camId);
  const playbackDeviceIdRef = useRef(playbackDeviceId);
  const startMicMutedRef = useRef(startMicMuted);
  const startCamActiveRef = useRef(startCamActive);
  const agoraClient = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
  );
  const agoraScreenClient = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
  );
  const agoraDimClient = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
  );
  const agoraChatClient = useRef(
    new AgoraChat.connection({
      appKey: process.env.REACT_APP_AGORA_APP_KEY,
    }),
  );

  const isHost = useMemo(
    () => meeting?.customerId === user.id,
    [meeting, user],
  );

  const audioMuted = useMemo(
    () => (localAudioTrack ? localAudioTrack.muted : true),
    [localAudioTrack],
  );

  const screens = useMemo(() => {
    const arr = [
      {
        screenId: `${user.id}_rtc`,
        userId: user.id,
        userFullName: user.fullName,
        userProfileImage: user.profileImage,
        hasAudio: localAudioTrack
          ? !localAudioTrack.muted && localAudioTrack.enabled
          : false,
        hasVideo: localVideoTrack
          ? !localVideoTrack.muted && localVideoTrack.enabled
          : false,
        type: "rtc",
        playTrack: () => {
          const track = agoraClient.current.localTracks.find(
            (track) => track.trackMediaType === "video",
          );

          if (track) {
            track.play(`${user.id}_rtc`);
          }
        },
      },
    ];

    if (localScreenTrack) {
      arr.push({
        screenId: `${user.id}_screen`,
        userId: user.id,
        userFullName: user.fullName,
        userProfileImage: user.profileImage,
        hasAudio: false,
        hasVideo: true,
        type: "video",
        playTrack: () => {
          const track = agoraScreenClient.current.localTracks.find(
            (track) => track.trackMediaType === "video",
          );

          if (track) {
            track.play(`${user.id}_screen`);
          }
        },
      });
    }

    remoteUsers.forEach((remoteUser) => {
      arr.push({
        screenId: `${remoteUser.uid}_rtc`,
        userId: remoteUser.uid,
        userFullName: remoteUser.fullName,
        userProfileImage: remoteUser.profileImage,
        hasAudio: remoteUser.hasAudio,
        hasVideo: remoteUser.hasVideo,
        type: "rtc",
        playTrack: () => {
          if (remoteUser.hasVideo && remoteUser.videoTrack) {
            remoteUser.videoTrack.play(`${remoteUser.uid}_rtc`);
          }
        },
      });

      if (remoteUser.hasScreen && remoteUser.screenTrack) {
        arr.push({
          screenId: `${remoteUser.uid}_screen`,
          userId: remoteUser.uid,
          userFullName: remoteUser.fullName,
          userProfileImage: remoteUser.profileImage,
          hasAudio: false,
          hasVideo: true,
          type: "video",
          playTrack: () => {
            remoteUser.screenTrack.play(`${remoteUser.uid}_screen`);
          },
        });
      }

      if (remoteUser.hasDim && remoteUser.dimTrack) {
        arr.push({
          screenId: `${remoteUser.uid}_dim`,
          userId: remoteUser.uid,
          userFullName: remoteUser.fullName,
          userProfileImage: remoteUser.profileImage,
          hasAudio: false,
          hasVideo: true,
          type: "video",
          playTrack: () => {
            remoteUser.dimTrack.play(`${remoteUser.uid}_dim`);
          },
        });
      }
    });

    return arr;
  }, [localAudioTrack, localScreenTrack, localVideoTrack, remoteUsers, user]);

  const mainScreen = useMemo(() => {
    if (sharingDimId || (sharedDimId && joinedSharedDim)) {
      return null;
    }

    if (mainScreenId) {
      const screen = screens.find((screen) => screen.screenId === mainScreenId);
      if (screen) return screen;
    }

    const myRtcScreen = screens.find(
      (screen) => screen.type === "rtc" && screen.userId === user.id,
    );

    const randomVideoScreen = screens.find((screen) => screen.hasVideo);

    if (!myRtcScreen.hasVideo && randomVideoScreen) {
      return randomVideoScreen;
    }

    return myRtcScreen;
  }, [sharingDimId, sharedDimId, joinedSharedDim, mainScreenId, screens, user]);

  const otherScreens = useMemo(
    () => screens.filter((screen) => screen.screenId !== mainScreen?.screenId),
    [mainScreen, screens],
  );

  const participants = useMemo(() => {
    const me = {
      uid: user.id,
      name: user.fullName,
      profileImage: user.profileImage,
      hasAudio: localAudioTrack
        ? !localAudioTrack.muted && localAudioTrack.enabled
        : false,
      hasVideo: localVideoTrack
        ? !localVideoTrack.muted && localVideoTrack.enabled
        : false,
      talking: talking,
      isHost,
    };

    const remote = remoteUsers.map((remoteUser) => {
      return {
        uid: remoteUser.uid,
        name: remoteUser.fullName,
        profileImage: remoteUser.profileImage,
        hasAudio: remoteUser.hasAudio,
        hasVideo: remoteUser.hasVideo,
        talking: remoteUser.talking,
        isHost: meeting?.customerId === remoteUser.uid,
      };
    });

    return [me, ...remote];
  }, [
    localAudioTrack,
    localVideoTrack,
    remoteUsers,
    user,
    talking,
    isHost,
    meeting,
  ]);

  const sharingDimScreenObj = useMemo(
    () => ({ type: "dim", dimensionId: sharingDimId }),
    [sharingDimId],
  );
  const sharedDimScreenObj = useMemo(
    () => ({ type: "dim", dimensionId: sharedDimId }),
    [sharedDimId],
  );

  const publishAudio = useCallback(async () => {
    try {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        AEC: true,
        microphoneId: micIdRef.current || undefined,
      });

      await audioTrack.setMuted(startMicMutedRef.current);
      await agoraClient.current.publish(audioTrack);

      setLocalAudioTrack({
        muted: audioTrack.muted,
        enabled: audioTrack.enabled,
      });
    } catch (error) {
      console.error(`Error publishing audio track: ${error.message}`);
    }
  }, []);

  const publishCamera = useCallback(async () => {
    try {
      const videoTrack = await AgoraRTC.createCameraVideoTrack({
        cameraId: camIdRef.current || undefined,
      });

      await agoraClient.current.publish(videoTrack);

      setLocalVideoTrack({ enabled: videoTrack.enabled });
    } catch (error) {
      console.error(`Error publishing video track: ${error.message}`);
    }
  }, []);

  const unPublishCamera = useCallback(async () => {
    try {
      const localVideoTrack = agoraClient.current.localTracks.find(
        (track) => track.trackMediaType === "video",
      );

      if (localVideoTrack) {
        localVideoTrack.close();
        await agoraClient.current.unpublish(localVideoTrack);
        setLocalVideoTrack(null);
      }
    } catch (error) {
      console.error(`Error publishing video track: ${error.message}`);
    }
  }, []);

  const publishScreen = useCallback(async () => {
    try {
      const screenTrack = await AgoraRTC.createScreenVideoTrack();

      await screenTrack.setMuted(false);
      await agoraScreenClient.current.publish(screenTrack);

      setLocalScreenTrack({ enabled: screenTrack.enabled });
    } catch (error) {
      console.error(`Error publishing screen track: ${error.message}`);
    }
  }, []);

  const unPublishScreen = useCallback(async () => {
    try {
      const localScreenTrack = agoraScreenClient.current.localTracks.find(
        (track) => track.trackMediaType === "video",
      );

      if (localScreenTrack) {
        localScreenTrack.close();
        await agoraScreenClient.current.unpublish(localScreenTrack);
        setLocalScreenTrack(null);
      }
    } catch (error) {
      console.error(`Error publishing video track: ${error.message}`);
    }
  }, []);

  const publishDim = useCallback(async (canvas) => {
    try {
      const stream = canvas.captureStream(30);
      const videoTrack = stream.getVideoTracks()[0];

      if (videoTrack) {
        const track = AgoraRTC.createCustomVideoTrack({
          mediaStreamTrack: videoTrack,
          optimizationMode: "motion",
        });

        await track.setMuted(false);
        await agoraDimClient.current.publish(track);
      }
    } catch (error) {
      console.error(`Error publishing dim track: ${error.message}`);
    }
  }, []);

  const unPublishDim = useCallback(async () => {
    try {
      const localDimTrack = agoraDimClient.current.localTracks.find(
        (track) => track.trackMediaType === "video",
      );

      if (localDimTrack) {
        localDimTrack.close();
        await agoraDimClient.current.unpublish(localDimTrack);
        setSharingDimId(null);
      }
    } catch (error) {
      console.error(`Error publishing video track: ${error.message}`);
    }
  }, []);

  const initMeeting = useCallback(
    async (meeting) => {
      if (joinTriesRef.current > 20) {
        navigate("/meetings");
        return;
      }

      try {
        const appId = process.env.REACT_APP_AGORA_APP_ID;

        const agoraRte = await SocialEventService.getAgoraRteTokens(
          meetingId,
          meeting.customerId === user?.id ? "PUBLISHER" : "SUBSCRIBER",
          user.id,
          8 * 60 * 60,
        );

        await agoraClient.current.join(
          appId,
          meetingId,
          agoraRte.rtcToken,
          user.id,
        );
        await agoraScreenClient.current.join(
          appId,
          meetingId,
          agoraRte.rtcScreenToken,
          user.id + 1e9,
        );
        await agoraDimClient.current.join(
          appId,
          meetingId,
          agoraRte.rtcDimToken,
          user.id + 1e6,
        );

        await agoraChatClient.current.open({
          user: user.id.toString(),
          agoraToken: agoraRte.chatToken,
        });

        const { data: rooms } = await agoraChatClient.current.getChatRooms({
          pagenum: 1,
          pagesize: 1000,
        });

        const roomId = rooms.find((room) => room.name === meetingId)?.id;
        if (roomId) {
          await agoraChatClient.current.joinChatRoom({ roomId });

          try {
            let cursor = -1;

            while (true) {
              const { messages } =
                await agoraChatClient.current.getHistoryMessages({
                  chatType: "chatRoom",
                  targetId: roomId,
                  searchDirection: "down",
                  pageSize: 50,
                  cursor,
                });

              if (messages.length === 0) break;

              const filteredMessages = messages.filter(
                (message) => !isSystemMsg(message.msg),
              );

              setMessages((prev) => [
                ...prev,
                ...filteredMessages.map((message) => {
                  const name = message.msg.split("%%%")[0];
                  const profileImage = message.msg.split("%%%")[1];
                  const text = message.msg.split("%%%")[2];

                  return {
                    from: message.from,
                    msg: text,
                    profileImage,
                    name,
                    owner: Number(message.from) === myUidRef.current,
                  };
                }),
              ]);

              cursor = messages[messages.length - 1].id;
            }
          } catch (error) {
            console.error("Failed to fetch chat history", error);
          }

          setChatRoomId(roomId);
        }

        try {
          await publishAudio();
        } catch (ignored) {}

        if (startCamActiveRef.current) {
          try {
            await publishCamera();
          } catch (ignored) {}
        }

        setLoading(false);
      } catch (error) {
        console.error(`Error joining meeting: ${error.message}`);

        setTimeout(() => {
          joinTriesRef.current = joinTriesRef.current + 1;
          initMeeting(meeting);
        }, 250);
      }
    },
    [navigate, meetingId, user.id, publishAudio, publishCamera],
  );

  const sendMessage = useCallback(
    async (_text) => {
      try {
        if (agoraChatClient.current.isOpened() && chatRoomId) {
          if (isSystemMsg(_text)) {
            await agoraChatClient.current.send(
              AgoraChat.message.create({
                chatType: "chatRoom",
                type: "txt",
                to: chatRoomId,
                msg: _text,
              }),
            );
          } else {
            const text = `${user.fullName}%%%${user.profileImage}%%%${_text}`;

            await agoraChatClient.current.send(
              AgoraChat.message.create({
                chatType: "chatRoom",
                type: "txt",
                to: chatRoomId,
                msg: text,
              }),
            );

            setMessages((prev) => [
              ...prev,
              {
                from: user.id,
                msg: _text,
                profileImage: user.profileImage,
                name: user.fullName,
                owner: true,
              },
            ]);
          }
        }
      } catch (error) {
        console.log(`Error sending message: ${error.message}`);
      }
    },
    [chatRoomId, user],
  );

  const SystemMessage = useMemo(() => {
    return {
      shareDim: (dimId) => {
        sendMessage(formatSystemMsg(`SHAREDIM_${user.id}_${dimId}`));
        setSharingDimId(dimId);
      },
      endMeeting: () => sendMessage(formatSystemMsg("END_MEETING")),
    };
  }, [sendMessage, user]);

  const handleSystemMsg = useCallback(
    (msg) => {
      if (msg.includes("END_MEETING")) {
        notification.info({
          message: "Host has ended this meeting.",
        });
        navigate("/meetings");
      } else if (msg.includes("SHAREDIM")) {
        const dimId = msg.split("_")[3];
        setSharedDimId(Number(dimId));
        notification.info({
          message:
            'Host is sharing a dimension. Click "Join Dimension" to join the shared dimension.',
        });
      }
    },
    [navigate],
  );

  const setMainScreen = useCallback(
    (id) => {
      if (!sharingDimId && !joinedSharedDim) {
        setMainScreenId(id);
      }
    },
    [joinedSharedDim, sharingDimId],
  );

  const toggleAudioMute = useCallback(async () => {
    try {
      const localAudioTrack = agoraClient.current.localTracks.find(
        (track) => track.trackMediaType === "audio",
      );

      if (localAudioTrack) {
        await localAudioTrack.setMuted(!localAudioTrack.muted);

        setLocalAudioTrack({
          muted: localAudioTrack.muted,
          enabled: localAudioTrack.enabled,
        });
      }
    } catch (error) {
      console.error(`Error muting audio track: ${error.message}`);
    }
  }, []);

  const toggleVideo = useCallback(async () => {
    try {
      if (localVideoTrack?.enabled) unPublishCamera();
      else publishCamera();
    } catch (error) {
      console.error(`Error muting video track: ${error.message}`);
    }
  }, [localVideoTrack, publishCamera, unPublishCamera]);

  const toggleSoundMute = useCallback(async () => {
    try {
      if (soundMutedRef.current) {
        remoteUsers.forEach((remoteUser) => {
          if (remoteUser.hasAudio) {
            remoteUser.audioTrack.play();
          }
        });

        setSoundMuted(false);
      } else {
        remoteUsers.forEach((remoteUser) => {
          if (remoteUser.hasAudio) {
            remoteUser.audioTrack.stop();
          }
        });

        setSoundMuted(true);
      }
    } catch (error) {
      console.error(`Error muting video track: ${error.message}`);
    }
  }, [remoteUsers]);

  useEffect(() => {
    (async () => {
      if (user) {
        try {
          const { data: _meeting } = await SocialEventService.getMeetingInfo(
            meetingId,
          );

          if (_meeting) {
            agoraClient.current.removeAllListeners();
            agoraChatClient.current.removeEventHandler("connection&message");
            agoraClient.current.enableAudioVolumeIndicator();

            agoraChatClient.current.addEventHandler("connection&message", {
              onConnected: async () => {
                console.info("Chat Connected");
              },
              onDisconnected: () => {
                console.info("Chat Disconnedted");
                setLoading(true);
              },
              onTextMessage: (message) => {
                if (isSystemMsg(message.msg)) {
                  handleSystemMsg(message.msg);
                } else {
                  const name = message.msg.split("%%%")[0];
                  const profileImage = message.msg.split("%%%")[1];
                  const text = message.msg.split("%%%")[2];

                  setMessages((prev) => [
                    ...prev,
                    {
                      from: message.from,
                      msg: text,
                      profileImage,
                      name,
                      owner: false,
                    },
                  ]);
                }
              },
              onError: (error) => {
                console.log("on error\n", error);
              },
            });

            agoraClient.current.on("user-joined", async (joinedUser) => {
              if (joinedUser.uid > 1e6) return;

              try {
                const { data: userData } =
                  await CommonService.getPublicUserData(joinedUser.uid);

                if (userData) {
                  setRemoteUsers((prev) => {
                    const remoteUsers = [...prev];

                    remoteUsers.push({
                      uid: userData.id,
                      fullName: userData.fullName,
                      profileImage: userData.profileImage,
                      audioTrack: joinedUser.audioTrack,
                      hasAudio: joinedUser.hasAudio,
                      videoTrack: joinedUser.videoTrack,
                      hasVideo: joinedUser.hasVideo,
                      hasScreen: false,
                      screenTrack: undefined,
                      hasDim: false,
                      dimTrack: undefined,
                    });

                    return remoteUsers;
                  });
                }
              } catch (error) {
                console.error(`Error fetching user data ${error.message}`);
              }
            });

            agoraClient.current.on("user-left", async (leavingUser) => {
              if (leavingUser.uid > 1e6) return;

              setRemoteUsers((prev) => {
                let remoteUsers = [...prev];

                remoteUsers = remoteUsers.filter(
                  (user) => user.uid !== leavingUser.uid,
                );

                return remoteUsers;
              });
            });

            agoraClient.current.on(
              "user-published",
              async (publishingUser, mediaType) => {
                try {
                  await agoraClient.current.subscribe(
                    publishingUser,
                    mediaType,
                  );

                  if (publishingUser.uid > 1e9) {
                    setRemoteUsers((prev) => {
                      const remoteUsers = [...prev];
                      const idx = remoteUsers.findIndex(
                        (user) => user.uid === publishingUser.uid - 1e9,
                      );

                      if (idx > -1) {
                        remoteUsers[idx].screenTrack =
                          publishingUser.videoTrack;
                        remoteUsers[idx].hasScreen = publishingUser.hasVideo;
                      }

                      return remoteUsers;
                    });
                  } else if (publishingUser.uid > 1e6) {
                    setRemoteUsers((prev) => {
                      const remoteUsers = [...prev];
                      const idx = remoteUsers.findIndex(
                        (user) => user.uid === publishingUser.uid - 1e6,
                      );

                      if (idx > -1) {
                        remoteUsers[idx].dimTrack = publishingUser.videoTrack;
                        remoteUsers[idx].hasDim = publishingUser.hasVideo;
                      }

                      return remoteUsers;
                    });
                  } else {
                    if (mediaType === "audio" && !soundMutedRef.current) {
                      publishingUser.audioTrack.play();

                      if (playbackDeviceIdRef.current) {
                        try {
                          await publishingUser.audioTrack.setPlaybackDevice(
                            playbackDeviceIdRef.current,
                          );
                        } catch (ignored) {}
                      }
                    }

                    setRemoteUsers((prev) => {
                      const remoteUsers = [...prev];
                      const idx = remoteUsers.findIndex(
                        (user) => user.uid === publishingUser.uid,
                      );

                      if (idx > -1) {
                        remoteUsers[idx].audioTrack = publishingUser.audioTrack;
                        remoteUsers[idx].hasAudio = publishingUser.hasAudio;
                        remoteUsers[idx].videoTrack = publishingUser.videoTrack;
                        remoteUsers[idx].hasVideo = publishingUser.hasVideo;
                      }

                      return remoteUsers;
                    });
                  }
                } catch (error) {
                  console.error(`Error subscribing track: ${error.message}`);
                }
              },
            );

            agoraClient.current.on(
              "user-unpublished",
              async (unPublishingUser, mediaType) => {
                try {
                  await agoraClient.current.unsubscribe(
                    unPublishingUser,
                    mediaType,
                  );

                  if (unPublishingUser.uid > 1e9) {
                    setRemoteUsers((prev) => {
                      const remoteUsers = [...prev];
                      const idx = remoteUsers.findIndex(
                        (user) => user.uid === unPublishingUser.uid - 1e9,
                      );

                      if (idx > -1) {
                        remoteUsers[idx].screenTrack =
                          unPublishingUser.videoTrack;
                        remoteUsers[idx].hasScreen = unPublishingUser.hasVideo;
                      }

                      return remoteUsers;
                    });

                    if (unPublishingUser.uid - 1e9 === myUidRef.current) {
                      await unPublishScreen();
                    }
                  } else if (unPublishingUser.uid > 1e6) {
                    setRemoteUsers((prev) => {
                      const remoteUsers = [...prev];
                      const idx = remoteUsers.findIndex(
                        (user) => user.uid === unPublishingUser.uid - 1e6,
                      );

                      if (idx > -1) {
                        remoteUsers[idx].dimTrack = unPublishingUser.videoTrack;
                        remoteUsers[idx].hasDim = unPublishingUser.hasVideo;
                      }

                      return remoteUsers;
                    });

                    setSharedDimId(null);
                    setJoinedSharedDim(false);

                    if (unPublishingUser.uid - 1e6 === myUidRef.current) {
                      await unPublishDim();
                    }
                  } else {
                    setRemoteUsers((prev) => {
                      const remoteUsers = [...prev];
                      const idx = remoteUsers.findIndex(
                        (user) => user.uid === unPublishingUser.uid,
                      );

                      if (idx > -1) {
                        remoteUsers[idx].audioTrack =
                          unPublishingUser.audioTrack;
                        remoteUsers[idx].hasAudio = unPublishingUser.hasAudio;
                        remoteUsers[idx].videoTrack =
                          unPublishingUser.videoTrack;
                        remoteUsers[idx].hasVideo = unPublishingUser.hasVideo;
                      }

                      return remoteUsers;
                    });
                  }
                } catch (error) {
                  console.error(`Error un-subscribing track: ${error.message}`);
                }
              },
            );

            agoraClient.current.on("user-info-updated", (uid) => {
              const remoteUser = agoraClient.current.remoteUsers.find(
                (remoteUser) => remoteUser.uid === uid,
              );

              if (remoteUser !== null) {
                setRemoteUsers((prev) => {
                  const remoteUsers = [...prev];
                  const idx = remoteUsers.findIndex(
                    (user) => user.uid === remoteUser.uid,
                  );

                  if (idx > -1) {
                    remoteUsers[idx].audioTrack = remoteUser.audioTrack;
                    remoteUsers[idx].hasAudio = remoteUser.hasAudio;
                    remoteUsers[idx].videoTrack = remoteUser.videoTrack;
                    remoteUsers[idx].hasVideo = remoteUser.hasVideo;
                  }

                  return remoteUsers;
                });
              }
            });

            agoraClient.current.on("volume-indicator", (arr) => {
              if (!arr?.length) return;

              const myVol =
                arr.find((vol) => vol.uid === myUidRef.current)?.level || 0;

              setTalking(myVol >= 30);

              setRemoteUsers((prev) => {
                const remoteUsers = [...prev];

                arr.forEach((vol) => {
                  const idx = remoteUsers.findIndex(
                    (user) => user.uid === vol.uid,
                  );

                  if (idx > -1) {
                    remoteUsers[idx].talking = vol.level >= 30;
                  }
                });

                return remoteUsers;
              });
            });

            setMeeting(_meeting);
            initMeeting(_meeting);
          } else {
            navigate("/meetings");
          }
        } catch (error) {
          console.error(`Error fetching meeting details ${error.message}`);
          navigate("/meetings");
        }
      }
    })();
  }, [
    initMeeting,
    navigate,
    meetingId,
    user,
    handleSystemMsg,
    unPublishScreen,
    unPublishDim,
  ]);

  useEffect(() => {
    (async () => {
      const remoteSharingDim = remoteUsers.some(
        (remoteUser) => remoteUser.hasDim,
      );

      if (remoteSharingDim && !sharedDimId) {
        try {
          let cursor = -1;
          while (true) {
            const { messages } =
              await agoraChatClient.current.getHistoryMessages({
                chatType: "chatRoom",
                targetId: chatRoomId,
                searchDirection: "up",
                pageSize: 50,
                cursor,
              });

            if (messages.length === 0) return;

            const dimMsg = messages.find(
              (message) =>
                isSystemMsg(message.msg) && message.msg.includes("SHAREDIM"),
            )?.msg;

            if (!dimMsg) {
              cursor = messages[messages.length - 1].id;
              continue;
            }

            const dimId = dimMsg.split("_")[3];
            setSharedDimId(Number(dimId));
            return;
          }
        } catch (ignored) {}
      }
    })();
  }, [remoteUsers, chatRoomId, sharedDimId]);

  useEffect(() => {
    myUidRef.current = user?.id;
  }, [user]);

  useEffect(() => {
    soundMutedRef.current = soundMuted;
  }, [soundMuted]);

  useEffect(() => {
    return async () => {
      try {
        console.info("Leaving the meeting");
        setLoading(true);
        await unPublishCamera();
        await unPublishDim();
        await unPublishScreen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        await agoraDimClient.current.leave();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        await agoraScreenClient.current.leave();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        await agoraClient.current.leave();
        setLocalAudioTrack(null);
        setLocalVideoTrack(null);
        setLocalScreenTrack(null);
        setRemoteUsers([]);
        setSharedDimId(null);
        setSharingDimId(null);
        setJoinedSharedDim(false);
      } catch (error) {
        console.error(`Error leaving the meet channel: ${error.message}`);
      }
    };
  }, [unPublishCamera, unPublishDim, unPublishScreen]);

  if (!meetingId) {
    navigate("/new-meet", { replace: true });
    notification.error({ message: "Invalid meet link" });
    return null;
  }

  if (loading) {
    return (
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
    );
  }

  return (
    <Row className="virtual-support" gutter={[30, 15]} justify="center">
      <Col xs={24} md={24} xl={hideSider ? 22 : 17}>
        <Row justify="center" gutter={[0, 20]} style={{ height: "100%" }}>
          <Col xs={24} className="virtual-support-main">
            <Row
              align="middle"
              justify="space-between"
              style={{ marginBottom: "1rem" }}
            >
              <Typography.Text className="fz-18 fw-600">
                Virtual Support
              </Typography.Text>
              <Dropdown trigger={["click"]} overlay={inviteMenu}>
                <Row
                  align="middle"
                  className="clickable"
                  gutter={[8, 0]}
                  id="inviteParticipants"
                >
                  <Col>
                    <Row align="middle">
                      <ParticipantsSVG
                        style={{ width: "16px", height: "16px" }}
                        color="#44c9ff"
                      />
                    </Row>
                  </Col>

                  <Col>
                    <Typography.Text className="fw-400 invite-gradiant-text">
                      Invite Participant
                    </Typography.Text>
                  </Col>
                </Row>
              </Dropdown>
            </Row>

            <Row>
              {otherScreens.length > 4 ? (
                <Col xs={0} md={0} lg={24}>
                  <CustomSlider responsive={slideResponsive}>
                    {otherScreens.map((screen) => (
                      <MeetingScreen
                        key={screen.screenId}
                        screen={screen}
                        setMainScreen={setMainScreen}
                      />
                    ))}
                  </CustomSlider>
                </Col>
              ) : (
                <Col xs={24} md={24} lg={24}>
                  <div className="friend-screen-container">
                    {otherScreens.map((screen) => (
                      <MeetingScreen
                        key={screen.screenId}
                        screen={screen}
                        setMainScreen={setMainScreen}
                      />
                    ))}
                  </div>
                </Col>
              )}
            </Row>

            {sharedDimId && joinedSharedDim ? (
              <MeetingScreen
                isMain
                key={`${sharedDimId}_dim`}
                screen={sharedDimScreenObj}
                setMainScreen={setMainScreen}
                publishDim={publishDim}
                audioMuted={audioMuted}
                soundMuted={soundMuted}
                cameraEnabled={localVideoTrack?.enabled}
                toggleAudioMute={toggleAudioMute}
                toggleVideo={toggleVideo}
                toggleSoundMute={toggleSoundMute}
                publishScreen={publishScreen}
                unPublishScreen={unPublishScreen}
                sharingScreen={localScreenTrack?.enabled}
                SystemMessage={SystemMessage}
                unPublishDim={unPublishDim}
                sharingDim={!!sharingDimId}
                isHost={isHost}
                joinedSharedDim={joinedSharedDim}
                setJoinedSharedDim={setJoinedSharedDim}
                sharedDimId={sharedDimId}
              />
            ) : !!sharingDimId ? (
              <MeetingScreen
                isMain
                key={`${sharingDimId}_dim`}
                screen={sharingDimScreenObj}
                setMainScreen={setMainScreen}
                publishDim={publishDim}
                audioMuted={audioMuted}
                soundMuted={soundMuted}
                cameraEnabled={localVideoTrack?.enabled}
                toggleAudioMute={toggleAudioMute}
                toggleVideo={toggleVideo}
                toggleSoundMute={toggleSoundMute}
                publishScreen={publishScreen}
                unPublishScreen={unPublishScreen}
                sharingScreen={localScreenTrack?.enabled}
                SystemMessage={SystemMessage}
                unPublishDim={unPublishDim}
                sharingDim={!!sharingDimId}
                isHost={isHost}
                joinedSharedDim={joinedSharedDim}
                setJoinedSharedDim={setJoinedSharedDim}
                sharedDimId={sharedDimId}
              />
            ) : (
              <MeetingScreen
                isMain
                key={mainScreen?.screenId}
                screen={mainScreen}
                setMainScreen={setMainScreen}
                publishDim={publishDim}
                audioMuted={audioMuted}
                soundMuted={soundMuted}
                cameraEnabled={localVideoTrack?.enabled}
                toggleAudioMute={toggleAudioMute}
                toggleVideo={toggleVideo}
                toggleSoundMute={toggleSoundMute}
                publishScreen={publishScreen}
                unPublishScreen={unPublishScreen}
                sharingScreen={localScreenTrack?.enabled}
                SystemMessage={SystemMessage}
                unPublishDim={unPublishDim}
                sharingDim={!!sharingDimId}
                isHost={isHost}
                joinedSharedDim={joinedSharedDim}
                setJoinedSharedDim={setJoinedSharedDim}
                sharedDimId={sharedDimId}
              />
            )}
          </Col>
        </Row>
      </Col>

      <Col
        xs={hideSider ? 0 : 24}
        md={hideSider ? 0 : 24}
        xl={hideSider ? 0 : 7}
      >
        <div className="virtual-support-aside">
          <MeetAsaider
            isHost={isHost}
            chatLoading={!chatRoomId}
            messages={messages}
            sendMessage={sendMessage}
            participants={participants}
            setHideSider={setHideSider}
            activeBtn={activeBtn}
            setActiveBtn={setActiveBtn}
            setHoloModalOpen={setHoloModalOpen}
            SystemMessage={SystemMessage}
          />
        </div>
      </Col>

      <Col xs={hideSider ? 24 : 0} xl={hideSider ? 2 : 0}>
        <div className="virtual-support-hide-sider">
          <Row
            gutter={[
              { xs: 0, lg: 20 },
              { xs: 0, lg: 50 },
            ]}
            justify="space-between"
            align="middle"
          >
            <Col xs={0} xl={24}>
              <Row justify="center">
                <Image
                  preview={false}
                  src={logo}
                  className="clickable"
                  onClick={() => setHideSider(false)}
                />
              </Row>
            </Col>

            <Col xs={4} xl={24}>
              <Row justify="center">
                <Tooltip title="Participants">
                  <ParticipantsSVG
                    className="clickable"
                    onClick={() => {
                      setHideSider(false);
                      setActiveBtn("participant");
                    }}
                  />
                </Tooltip>
              </Row>
            </Col>

            {isHost ? (
              <Col xs={4} xl={24}>
                <Row justify="center">
                  <Tooltip title="Inventory">
                    <PackageSVG
                      className="clickable"
                      onClick={() => {
                        setHideSider(false);
                        setActiveBtn("inventory");
                      }}
                    />
                  </Tooltip>
                </Row>
              </Col>
            ) : (
              <Col xs={4} xl={24}>
                <Row justify="center">
                  <Tooltip title="My Cart">
                    <ShoppingCartSVG
                      className="clickable"
                      style={{ width: "22px", height: "22px" }}
                      color={"#8e8e93"}
                      onClick={() => {
                        setHideSider(false);
                        setActiveBtn("myCart");
                      }}
                    />
                  </Tooltip>
                </Row>
              </Col>
            )}

            <Col xs={4} xl={24}>
              <Row justify="center">
                <Tooltip title="Chat">
                  <SMSSVG
                    className="clickable"
                    onClick={() => {
                      setHideSider(false);
                      setActiveBtn("chat");
                    }}
                  />
                </Tooltip>
              </Row>
            </Col>

            {isHost && (
              <Col xs={4} xl={24}>
                <Row justify="center">
                  <Tooltip title="Holomeet">
                    <Image
                      className="clickable"
                      preview={false}
                      width={32}
                      height={32}
                      src={hologram}
                      onClick={() => setHoloModalOpen((prev) => !prev)}
                    />
                  </Tooltip>
                </Row>
              </Col>
            )}
          </Row>
        </div>
      </Col>

      <Modal
        footer={null}
        closable={false}
        onCancel={() => setHoloModalOpen(false)}
        open={holoModalOpen}
        centered
        mask={false}
        className="holomeet-modal"
      >
        <Holomeet />
      </Modal>
    </Row>
  );
}
