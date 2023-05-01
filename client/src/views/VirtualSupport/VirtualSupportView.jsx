import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Col,
  Dropdown,
  Grid,
  Image,
  Menu,
  message,
  notification,
  Row,
  Typography,
} from "antd";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraChat from "agora-chat";
import { createFastboard, apps } from "@netless/fastboard";

import userContext from "context/userContext";
import SocialEventService from "services/social-event.service";
import CommonService from "services/common.service";
import CustomSlider from "components/CustomSlider";
import logo from "assets/images/logo.png";
import { ParticipantsSVG, LinkSVG, AddUserSVG } from "assets/jsx-svg";

import MeetingScreen from "./MeetingScreen";
import MeetAsaider from "./MeetAsaider";
import InviteFriends from "./InviteFriends";
import HolomeetDim from "./HolomeetDim";
import MeetNavigateSide from "./MeetNavigateSide";

import { LoadingOutlined } from "@ant-design/icons";

import "./styles.css";

const slideResponsive = [
  {
    breakpoint: 3000,
    settings: {
      slidesToShow: 4,
      slidesToScroll: 4,
    },
  },
  {
    breakpoint: 1480,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 3,
    },
  },
  {
    breakpoint: 1120,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 3,
    },
  },
];

const formatSystemMsg = (msg) => `SYSTEM%%%${msg}`;
const isSystemMsg = (msg) => /^SYSTEM%%%[\s\S]*/.test(msg);

export default function VirtualSupportView({
  micId,
  camId,
  playbackDeviceId,
  startMicMuted,
  startCamActive,
}) {
  const location = useLocation();
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
  const [sharingFile, setSharingFile] = useState(null);
  const [sharedDimId, setSharedDimId] = useState(null);
  const [fastboard, setFastboard] = useState(null);
  const [joinedSharedDim, setJoinedSharedDim] = useState(false);
  const [talking, setTalking] = useState(false);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [permissions, setPermissions] = useState({
    screen: false,
    chat: true,
    mic: true,
    cam: true,
    whiteboard: true,
    canDownload: true,
  });
  const [hideSide, setHideSide] = useState(false);
  const [inviteParticipantsPopup, setInviteParticipantsPopup] = useState(false);
  const [askedForCounter, setAskedForCounter] = useState(false);
  const [counterFormData, setCounterFormData] = useState(null);
  const [counterSharedData, setCounterSharedData] = useState({});
  const [sharedHolomeetId, setSharedHolomeetId] = useState(null);
  const [dimensionFrames, setDimensionFrames] = useState(null);
  const [deskType, setDeskType] = useState("");
  const [iframeRef, setIframeRef] = useState(null);

  const { user } = useContext(userContext);
  const joinTriesRef = useRef(1);
  const soundMutedRef = useRef();
  const { meetingId } = useParams();
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const userRef = useRef(user);
  const micIdRef = useRef(micId);
  const camIdRef = useRef(camId);
  const playbackDeviceIdRef = useRef(playbackDeviceId);
  const startMicMutedRef = useRef(startMicMuted);
  const startCamActiveRef = useRef(startCamActive);
  const chatRoomIdRef = useRef(chatRoomId);
  const meetingRef = useRef(meeting);

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

  const screenSize = Grid.useBreakpoint();

  const isHost = useMemo(
    () => meeting?.customerId === user.id,
    [meeting, user],
  );
  const isHostRef = useRef(isHost);

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
    if (
      sharingDimId ||
      sharingFile ||
      fastboard ||
      (sharedDimId && joinedSharedDim)
    ) {
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
  }, [
    sharingDimId,
    sharingFile,
    fastboard,
    sharedDimId,
    joinedSharedDim,
    mainScreenId,
    screens,
    user.id,
  ]);

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
  const participantsRef = useRef(participants);

  const sharingFileScreenObj = useMemo(
    () => ({ type: "file", file: sharingFile }),
    [sharingFile],
  );

  const sharingDimScreenObj = useMemo(
    () => ({ type: "dim", dimensionId: sharingDimId }),
    [sharingDimId],
  );

  const sharedDimScreenObj = useMemo(
    () => ({ type: "dim", dimensionId: sharedDimId }),
    [sharedDimId],
  );

  const deskScreenObj = useMemo(() => {
    return { type: "desk", dimensionId: meeting?.dimensionId };
  }, [meeting?.dimensionId]);

  const whiteboardScreenObj = useMemo(
    () => ({ type: "whiteboard", room: fastboard }),
    [fastboard],
  );

  const sendMessage = useCallback(async (_text) => {
    try {
      if (agoraChatClient.current.isOpened() && chatRoomIdRef.current) {
        if (isSystemMsg(_text)) {
          await agoraChatClient.current.send(
            AgoraChat.message.create({
              chatType: "chatRoom",
              type: "txt",
              to: chatRoomIdRef.current,
              msg: _text,
            }),
          );
        } else {
          const text = `${userRef.current.fullName}%%%${userRef.current.profileImage}%%%${_text}`;

          await agoraChatClient.current.send(
            AgoraChat.message.create({
              chatType: "chatRoom",
              type: "txt",
              to: chatRoomIdRef.current,
              msg: text,
            }),
          );

          setMessages((prev) => [
            ...prev,
            {
              from: userRef.current.id,
              msg: _text,
              profileImage: userRef.current.profileImage,
              name: userRef.current.fullName,
              owner: true,
            },
          ]);
        }
      }
    } catch (error) {
      console.log(`Error sending message: ${error.message}`);
    }
  }, []);

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
      }
    } catch (error) {
      console.error(`Error un publishing dim track: ${error.message}`);
    }
  }, []);

  const SystemMessage = useMemo(() => {
    return {
      shareFile: (file) => {
        setSharingFile(file);
        sendMessage(
          formatSystemMsg(
            `PREVIEWFILE%%%${userRef.current.id}%%%${JSON.stringify(
              file,
            )}%%%${meetingId}`,
          ),
        );
      },

      shareDim: (dimId) => {
        setSharingDimId(dimId);
        sendMessage(
          formatSystemMsg(
            `SHAREDIM%%%${userRef.current.id}%%%${dimId}%%%${meetingId}`,
          ),
        );
      },

      shareWhiteboard: (whiteboardRoomId) =>
        sendMessage(
          formatSystemMsg(
            `SHAREWHITEBOARD%%%${userRef.current.id}%%%${whiteboardRoomId}%%%${meetingId}`,
          ),
        ),

      changePermissions: (permissions) =>
        sendMessage(
          formatSystemMsg(
            `PERMISSIONS%%%${JSON.stringify(permissions)}%%%${meetingId}`,
          ),
        ),

      changeSharedFiles: (files) =>
        sendMessage(
          formatSystemMsg(
            `SHAREDFILES%%%${JSON.stringify(files)}%%%${meetingId}`,
          ),
        ),

      hostShareCounterData: (data) => {
        sendMessage(
          formatSystemMsg(
            `COUNTERHOSTSENDDATA%%%${JSON.stringify(data)}%%%${meetingId}`,
          ),
        );
      },

      changeCounterUserSharedData: ({
        user,
        fullName = "",
        signature = null,
        file = null,
        customField = null,
      }) =>
        sendMessage(
          formatSystemMsg(
            `COUNTERUSERSENDDATA%%%${JSON.stringify(user)}%%%${JSON.stringify(
              fullName,
            )}%%%${JSON.stringify(signature)}%%%${JSON.stringify(
              file,
            )}%%%${JSON.stringify(customField)}%%%${meetingId}`,
          ),
        ),

      stopFilePreview: () => {
        setSharingFile(null);
        sendMessage(
          formatSystemMsg(`ENDFILEPREVIEW%%%${meetingId}%%%${meetingId}`),
        );
      },

      stopWhiteboard: () => {
        setFastboard((prev) => {
          if (prev) {
            try {
              prev.destroy();
            } catch (error) {
              console.log("Error destroying fastboard", error.message);
            }
          }

          return null;
        });
        sendMessage(
          formatSystemMsg(`ENDWHITEBOARD%%%${meetingId}%%%${meetingId}`),
        );
      },

      stopDim: () => {
        unPublishDim();
        setSharingDimId(null);
        sendMessage(formatSystemMsg(`ENDDIM%%%${meetingId}%%%${meetingId}`));
      },

      endMeeting: () =>
        sendMessage(formatSystemMsg(`ENDMEETING%%%${meetingId}`)),

      askAllUserForCounter: (dataAskedFor) => {
        sendMessage(
          formatSystemMsg(
            `ASKALLUSERFORCOUNTER%%%${JSON.stringify(
              dataAskedFor,
            )}%%%${meetingId}`,
          ),
        );
      },

      askSelectedUserForCounter: (usersAndDataAskedFor) => {
        sendMessage(
          formatSystemMsg(
            `ASKELECTEDUSERSFORCOUNTER%%%${JSON.stringify(
              usersAndDataAskedFor,
            )}%%%${meetingId}`,
          ),
        );
      },

      setHolomeet: (holomeetId = null) => {
        const defualtValueForPer = {
          screen: false,
          chat: true,
          mic: true,
          cam: true,
          whiteboard: true,
          canDownload: true,
        };
        const closeAllPer = {
          screen: false,
          chat: false,
          mic: false,
          cam: false,
          whiteboard: false,
          canDownload: false,
        };
        setSharedHolomeetId(holomeetId);
        sendMessage(
          formatSystemMsg(
            `SETHOLOMEET%%%${JSON.stringify(holomeetId)}%%%${meetingId}`,
          ),
        );
        if (holomeetId) {
          forceMuteMic();
          unPublishCamera();
          forceSoundMute();
          SystemMessage.changePermissions(closeAllPer);
          setPermissions(closeAllPer);
        } else {
          SystemMessage.changePermissions(defualtValueForPer);
          setPermissions(defualtValueForPer);

          toggleSoundMute();
        }
      },
    };
  }, [sendMessage, unPublishDim]);

  const joinWhiteboardRoom = useCallback(async (whiteboardRoomId) => {
    try {
      const {
        data: { whiteboardRoomToken },
      } = await SocialEventService.genWhiteboardRoomToken(whiteboardRoomId);

      const fastboard = await createFastboard({
        sdkConfig: {
          appIdentifier: process.env.REACT_APP_AGORA_WHITEBOARD_APP_ID,
          region: "gb-lon",
        },
        joinRoom: {
          uid: `${userRef.current.id}`,
          uuid: whiteboardRoomId,
          roomToken: whiteboardRoomToken,
          userPayload: {
            nickName: userRef.current.fullName,
          },
        },
        managerConfig: {
          cursor: true,
        },
      });

      apps.push(
        {
          icon: "https://api.iconify.design/logos:youtube-icon.svg?color=currentColor",
          kind: "Plyr",
          label: "YouTube",
          onClick() {
            setHideSide(false);
            setActiveBtn("youtubeLink");
          },
        },
        {
          icon: "https://png.pngtree.com/png-vector/20190514/ourmid/pngtree-emb--file-format-icon-design-png-image_1040671.jpg",
          kind: "EmbeddedPage",
          label: "Embed",
          onClick() {
            setHideSide(false);
            setActiveBtn("embedLink");
          },
        },
      );

      setFastboard(fastboard);
      return true;
    } catch (error) {
      console.log(`Error joining whiteboard: ${error.message}`);
      console.log(error);
      return false;
    }
  }, []);

  const shareWhiteboard = useCallback(async () => {
    try {
      const {
        data: { whiteboardRoomId },
      } = await SocialEventService.createWhiteboardRoom();

      const createdAndJoined = await joinWhiteboardRoom(whiteboardRoomId);

      if (createdAndJoined) {
        SystemMessage.shareWhiteboard(whiteboardRoomId);
      }
    } catch (error) {
      console.log(`Error sharing whiteboard: ${error.message}`);
      console.log(error);
    }
  }, [SystemMessage, joinWhiteboardRoom]);

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
        if (!roomId) {
          throw new Error(`Could not find roomId for meetingId: ${meetingId}`);
        }

        await agoraChatClient.current.joinChatRoom({ roomId });

        try {
          await publishAudio();
        } catch (ignored) {}

        if (startCamActiveRef.current) {
          try {
            await publishCamera();
          } catch (ignored) {}
        }

        if (isHostRef.current) {
          await agoraChatClient.current.send(
            AgoraChat.message.create({
              chatType: "chatRoom",
              type: "txt",
              to: roomId,
              msg: formatSystemMsg("HOSTJOINED"),
            }),
          );
        }
        setChatRoomId(roomId);
      } catch (error) {
        console.error(`Error joining meeting: ${error.message}`);

        setTimeout(() => {
          joinTriesRef.current = joinTriesRef.current + 1;
          initMeeting(meeting);
        }, 250);
      }
    },
    [navigate, meetingId, user, publishAudio, publishCamera],
  );

  const handleSystemMsg = useCallback(
    (msg) => {
      if (msg.includes("ENDMEETING")) {
        const currentMeetId = msg.split("%%%")[2];

        if (currentMeetId === meetingId) {
          notification.info({
            message: "Host has ended this meeting.",
          });
          navigate("/meetings");
        }
      } else if (msg.includes("ENDFILEPREVIEW")) {
        const currentMeetId = msg.split("%%%")[2];

        if (currentMeetId === meetingId) {
          setSharingFile(null);
        }
      } else if (msg.includes("ENDWHITEBOARD")) {
        const currentMeetId = msg.split("%%%")[2];

        if (currentMeetId === meetingId) {
          setFastboard(null);
        }
      } else if (msg.includes("ENDDIM")) {
        const currentMeetId = msg.split("%%%")[2];

        if (currentMeetId === meetingId) {
          setSharedDimId(null);
          setJoinedSharedDim(false);
        }
      } else if (msg.includes("SHAREWHITEBOARD")) {
        const whiteboardRoomId = msg.split("%%%")[3];
        const currentMeetId = msg.split("%%%")[4];

        if (currentMeetId === meetingId) {
          joinWhiteboardRoom(whiteboardRoomId);
          notification.info({
            message: "Host is sharing a whiteboard.",
          });
        }
      } else if (msg.includes("SHAREDIM")) {
        const dimId = msg.split("%%%")[3];
        const currentMeetId = msg.split("%%%")[4];

        if (currentMeetId === meetingId) {
          setSharedDimId(Number(dimId));
          notification.info({
            message:
              'Host is sharing a dimension. Click "Join Dimension" to join the shared dimension.',
          });
        }
      } else if (msg.includes("PERMISSIONS")) {
        try {
          const perms = JSON.parse(msg.split("%%%")[2]);
          const currentMeetId = msg.split("%%%")[3];

          if (currentMeetId === meetingId) {
            setPermissions(perms);
          }
        } catch (ignored) {}
      } else if (msg.includes("PREVIEWFILE")) {
        try {
          const file = JSON.parse(msg.split("%%%")[3]);
          const currentMeetId = msg.split("%%%")[4];

          if (currentMeetId === meetingId) {
            setSharingFile(file);
            notification.info({
              message: "Host is sharing a file.",
            });
          }
        } catch (ignored) {}
      } else if (msg.includes("ASKALLUSERFORCOUNTER")) {
        try {
          if (!isHost) {
            const dataAskedFor = JSON.parse(msg.split("%%%")[2]);
            const currentMeetId = msg.split("%%%")[3];

            if (currentMeetId === meetingId) {
              setCounterFormData(dataAskedFor.formData);

              participants.forEach((participant) => {
                if (participant.uid === user.id) {
                  notification.info({
                    message: `Host is asked you to submit ${dataAskedFor.formData.message}.`,
                  });
                  setAskedForCounter(true);
                  setActiveBtn("userCounter");
                }
              });
            }
          }
        } catch (ignored) {}
      } else if (msg.includes("ASKELECTEDUSERSFORCOUNTER")) {
        try {
          if (!isHost) {
            const usersAndDataAskedFor = JSON.parse(msg.split("%%%")[2]);
            const currentMeetId = msg.split("%%%")[3];

            if (currentMeetId === meetingId) {
              setCounterFormData(usersAndDataAskedFor.formData);
              if (usersAndDataAskedFor.users.includes(user.id)) {
                notification.info({
                  message: `Host is asked you to submit ${usersAndDataAskedFor.formData.message}.`,
                });
                setAskedForCounter(true);
                setActiveBtn("userCounter");
              }
            }
          }
        } catch (ignored) {}
      } else if (msg.includes("COUNTERUSERSENDDATA")) {
        try {
          const senderUser = JSON.parse(msg.split("%%%")[2]);
          const sharedFullName = JSON.parse(msg.split("%%%")[3]);
          const sharedSignature = JSON.parse(msg.split("%%%")[4]);
          const sharedfile = JSON.parse(msg.split("%%%")[5]);
          const sharedCustomField = JSON.parse(msg.split("%%%")[6]);
          const currentMeetId = msg.split("%%%")[7];

          if (currentMeetId === meetingId) {
            setCounterSharedData((prev) => {
              if (prev.hasOwnProperty(senderUser.id)) {
                prev[senderUser.id].userData = senderUser;

                if (sharedFullName) {
                  prev[senderUser.id].fullName = sharedFullName;
                }
                if (sharedSignature) {
                  prev[senderUser.id].signature = sharedSignature;
                }
                if (sharedfile) {
                  prev[senderUser.id].files = [
                    ...prev[senderUser.id].files,
                    sharedfile,
                  ];
                }

                if (sharedCustomField) {
                  prev[senderUser.id].customField = [
                    ...prev[senderUser.id].customField,
                    sharedCustomField,
                  ];
                }
              } else {
                prev[senderUser.id] = {
                  userData: senderUser,
                  fullName: sharedFullName,
                  signature: sharedSignature,
                  files: sharedfile ? [sharedfile] : [],
                  customField: sharedCustomField ? [sharedCustomField] : [],
                };
              }

              SystemMessage.hostShareCounterData({ ...prev });

              return { ...prev };
            });
          }
        } catch (ignored) {}
      } else if (msg.includes("SHAREDFILES")) {
        try {
          const files = JSON.parse(msg.split("%%%")[2]);
          const currentMeetId = msg.split("%%%")[3];

          if (currentMeetId === meetingId) {
            setSharedFiles(files);
          }
        } catch (ignored) {}
      } else if (msg.includes("SETHOLOMEET")) {
        try {
          const holomeetId = JSON.parse(msg.split("%%%")[2]);
          const currentMeetId = msg.split("%%%")[3];

          if (currentMeetId === meetingId) {
            setSharedHolomeetId(Number(holomeetId));

            if (holomeetId) {
              notification.info({
                message: "Host is sharing holomeet",
              });
              forceSoundMute();
              toggleSoundMute();
            }
          }
        } catch (ignored) {}
      }
    },
    [joinWhiteboardRoom, navigate],
  );

  const setMainScreen = useCallback(
    (id) => {
      if (!sharingFile && !sharingDimId && !joinedSharedDim) {
        setMainScreenId(id);
      }
    },
    [sharingFile, sharingDimId, joinedSharedDim],
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

  const forceMuteMic = useCallback(async () => {
    try {
      const localAudioTrack = agoraClient.current.localTracks.find(
        (track) => track.trackMediaType === "audio",
      );

      if (localAudioTrack && !localAudioTrack.muted) {
        await localAudioTrack.setMuted(true);

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

  const forceSoundMute = useCallback(async () => {
    try {
      remoteUsers.forEach((remoteUser) => {
        if (remoteUser.hasAudio) {
          remoteUser.audioTrack.stop();
        }
      });

      setSoundMuted(true);
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
            location.pathname.includes("vindo-desk") && "desk",
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

              if (leavingUser.uid === meetingRef.current.customerId) {
                SystemMessage.stopWhiteboard();
              }

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

                    if (unPublishingUser.uid - 1e9 === userRef.current.id) {
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

                    if (unPublishingUser.uid - 1e6 === userRef.current.id) {
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
                arr.find((vol) => vol.uid === userRef.current.id)?.level || 0;

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
            if (searchParams.get("type") === "desk") {
              setDeskType("desk");
            }
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
    SystemMessage,
  ]);

  useEffect(() => {
    if (chatRoomId) {
      (async () => {
        try {
          let cursor = -1;
          let systemMessages = [];

          while (true) {
            const { messages } =
              await agoraChatClient.current.getHistoryMessages({
                chatType: "chatRoom",
                targetId: chatRoomId,
                searchDirection: "down",
                pageSize: 50,
                cursor,
              });

            if (messages.length === 0) break;

            const normalMsgs = messages.filter((message) => {
              if (isSystemMsg(message.msg)) {
                systemMessages.push(message);
                return false;
              } else {
                return true;
              }
            });

            setMessages((prev) => [
              ...prev,
              ...normalMsgs.map((message) => {
                const name = message.msg.split("%%%")[0];
                const profileImage = message.msg.split("%%%")[1];
                const text = message.msg.split("%%%")[2];

                return {
                  from: message.from,
                  msg: text,
                  profileImage,
                  name,
                  owner: Number(message.from) === userRef.current.id,
                };
              }),
            ]);

            cursor = messages[messages.length - 1].id;
          }

          let shareFile = null;
          let whiteboardRoomId = null;
          let shareDim = null;
          let permissions = {};
          let sharedFiles = [];
          let counterSharedData = {};
          let sharedHolomeetId = null;

          systemMessages.forEach(async (message) => {
            console.warn(message);
            if (message.msg.includes("HOSTJOINED")) {
              shareFile = null;
              whiteboardRoomId = null;
              shareDim = null;
              sharedHolomeetId = null;
            } else if (message.msg.includes("ENDFILEPREVIEW")) {
              shareFile = null;
            } else if (message.msg.includes("ENDWHITEBOARD")) {
              whiteboardRoomId = null;
            } else if (message.msg.includes("ENDDIM")) {
              shareDim = null;
            } else if (message.msg.includes("SHAREWHITEBOARD")) {
              const roomId = message.msg.split("%%%")[3];
              whiteboardRoomId = roomId;
            } else if (message.msg.includes("SHAREDIM")) {
              const dimId = message.msg.split("%%%")[3];
              shareDim = dimId;
            } else if (message.msg.includes("PERMISSIONS")) {
              try {
                const perms = JSON.parse(message.msg.split("%%%")[2]);
                permissions = perms;
              } catch (ignored) {}
            } else if (message.msg.includes("COUNTERHOSTSENDDATA")) {
              try {
                const sharedData = JSON.parse(message.msg.split("%%%")[2]);
                counterSharedData = sharedData;
              } catch (ignored) {}
            } else if (message.msg.includes("SHAREDFILES")) {
              try {
                const files = JSON.parse(message.msg.split("%%%")[2]);
                sharedFiles = files;
              } catch (ignored) {}
            } else if (message.msg.includes("PREVIEWFILE")) {
              try {
                const file = JSON.parse(message.msg.split("%%%")[3]);
                shareFile = file;
              } catch (ignored) {}
            } else if (message.msg.includes("SETHOLOMEET")) {
              try {
                const holomeetId = JSON.parse(message.msg.split("%%%")[2]);
                sharedHolomeetId = holomeetId;
              } catch (ignored) {}
            }
          });

          if (isHost && sharedHolomeetId) {
            SystemMessage.setHolomeet(null);
            forceMuteMic();
            unPublishCamera();
            forceSoundMute();
          }

          setPermissions(permissions);
          setSharedFiles(sharedFiles);
          setCounterSharedData(counterSharedData);
          setSharedHolomeetId(Number(sharedHolomeetId));

          const isHostPresent = participantsRef.current?.some(
            (p) => p.uid === meetingRef.current?.customerId,
          );

          if (!isHostRef.current && isHostPresent) {
            if (shareFile) {
              notification.info({
                message: "Host is sharing a file.",
              });
              setSharingFile(shareFile);
            }

            if (whiteboardRoomId) {
              notification.info({
                message: "Host is sharing a whiteboard.",
              });
              joinWhiteboardRoom(whiteboardRoomId);
            }

            if (shareDim) {
              notification.info({
                message:
                  'Host is sharing a dimension. Click "Join Dimension" to join the shared dimension.',
              });
              setSharedDimId(Number(shareDim));
            }
          }

          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch chat history", error);
        }
      })();
    }
  }, [joinWhiteboardRoom, chatRoomId]);

  useEffect(() => {
    if (isHost) {
      SystemMessage.changePermissions(permissions);
    }
  }, [isHost, SystemMessage, permissions]);

  useEffect(() => {
    if (isHost) {
      SystemMessage.changeSharedFiles(sharedFiles);
    }
  }, [isHost, SystemMessage, sharedFiles]);

  useEffect(() => {
    if (!isHost) {
      SystemMessage.changeCounterUserSharedData(counterSharedData);
    }
  }, [isHost, SystemMessage, counterSharedData]);

  useEffect(() => {
    if (!isHost && !permissions.screen) unPublishScreen();

    if (!isHost && !permissions.mic) forceMuteMic();

    if (!isHost && !permissions.cam) unPublishCamera();

    if (fastboard) {
      if (isHost || permissions.whiteboard) fastboard.room.setWritable(true);
      else fastboard.room.setWritable(false);
    }
  }, [
    isHost,
    fastboard,
    permissions,
    unPublishScreen,
    forceMuteMic,
    unPublishCamera,
  ]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    soundMutedRef.current = soundMuted;
  }, [soundMuted]);

  useEffect(() => {
    chatRoomIdRef.current = chatRoomId;
  }, [chatRoomId]);

  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);

  useEffect(() => {
    meetingRef.current = meeting;
  }, [meeting]);

  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  if (!meetingId) {
    notification.error({ message: "Invalid meet link" });
    navigate("/new-meet", { replace: true });
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
              open={inviteParticipantsPopup}
              dropdownRender={() => (
                <InviteFriends
                  setInviteParticipantsPopup={setInviteParticipantsPopup}
                />
              )}
              destroyPopupOnHide
              getPopupContainer={() =>
                document.getElementById("inviteParticipants")
              }
              onOpenChange={(e) => {
                setInviteParticipantsPopup(e);
              }}
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
          onClick: () => setInviteParticipantsPopup(true),
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

  return (
    <>
      <Row className="virtual-support" gutter={[32, 32]} justify="center">
        <Col {...(hideSide ? null : { xs: 24, xl: hideSide ? 2 : 8 })}>
          <Row wrap={false} className="h-100">
            <Col
              flex={hideSide && 1}
              className="virtual-support-nav-sider-holder"
            >
              <div
                className="virtual-support-nav-sider"
                style={{ borderRadius: hideSide && "30px" }}
              >
                <MeetNavigateSide
                  isHost={isHost}
                  activeBtn={activeBtn}
                  setActiveBtn={setActiveBtn}
                  setHideSide={setHideSide}
                  sharedDimId={sharedDimId}
                  askedForCounter={askedForCounter}
                />
              </div>
            </Col>
            {!hideSide && (screenSize.xl || screenSize.xxl) && (
              <Col flex={1} className="virtual-support-aside-hide">
                <div className="virtual-support-aside">
                  <MeetAsaider
                    isHost={isHost}
                    chatLoading={!chatRoomId}
                    messages={messages}
                    sendMessage={sendMessage}
                    participants={participants}
                    activeBtn={activeBtn}
                    setActiveBtn={setActiveBtn}
                    SystemMessage={SystemMessage}
                    shareWhiteboard={shareWhiteboard}
                    permissions={permissions}
                    sharedFiles={sharedFiles}
                    setSharedFiles={setSharedFiles}
                    sharedDimId={sharedDimId}
                    sharingDimId={sharingDimId}
                    unPublishScreen={unPublishScreen}
                    publishScreen={publishScreen}
                    sharingScreen={localScreenTrack?.enabled}
                    sharingDim={!!sharingDimId}
                    sharingFile={!!sharingFile}
                    sharingWhiteboard={!!fastboard}
                    setHideSide={setHideSide}
                    fastboard={fastboard}
                    joinedSharedDim={joinedSharedDim}
                    setJoinedSharedDim={setJoinedSharedDim}
                    setAskedForCounter={setAskedForCounter}
                    counterFormData={counterFormData}
                    counterSharedData={counterSharedData}
                    dimensionFrames={dimensionFrames}
                    iframeRef={iframeRef}
                  />
                </div>
              </Col>
            )}
          </Row>
        </Col>

        <Col
          {...(hideSide
            ? { flex: 1 }
            : {
                xs: 24,
                md: 24,
                xl: hideSide ? 22 : 16,
                xxl: hideSide ? 22 : 16,
              })}
        >
          <Row justify="center" gutter={[0, 20]} style={{ height: "100%" }}>
            <Col
              xs={24}
              className="virtual-support-main"
              style={{ padding: deskType === "desk" && "0px" }}
            >
              {deskType !== "desk" && (
                <>
                  <Row
                    align="middle"
                    justify="space-between"
                    style={{
                      marginBottom: "1rem",
                      borderBottom: "1px solid #E5E5EAD9",
                      padding: "24px 0",
                    }}
                  >
                    <Typography.Text className="fz-18 fw-600">
                      Vindo
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
                              color="#0129B7"
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
                              iframeRef={iframeRef}
                              setIframeRef={setIframeRef}
                              setCounterSharedData={setCounterSharedData}
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
                              iframeRef={iframeRef}
                              setIframeRef={setIframeRef}
                              setCounterSharedData={setCounterSharedData}
                            />
                          ))}
                        </div>
                      </Col>
                    )}
                  </Row>
                </>
              )}

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
                  sharingFile={!!sharingFile}
                  sharingWhiteboard={!!fastboard}
                  isHost={isHost}
                  joinedSharedDim={joinedSharedDim}
                  setJoinedSharedDim={setJoinedSharedDim}
                  sharedDimId={sharedDimId}
                  permissions={permissions}
                  setPermissions={setPermissions}
                  setActiveBtn={setActiveBtn}
                  activeBtn={activeBtn}
                  askedForCounter={askedForCounter}
                  setHideSide={setHideSide}
                  messages={messages}
                  sendMessage={sendMessage}
                  participants={participants}
                  shareWhiteboard={shareWhiteboard}
                  sharedFiles={sharedFiles}
                  setSharedFiles={setSharedFiles}
                  sharingDimId={sharingDimId}
                  fastboard={fastboard}
                  setAskedForCounter={setAskedForCounter}
                  counterFormData={counterFormData}
                  counterSharedData={counterSharedData}
                  localScreenTrack={localScreenTrack}
                  chatRoomId={chatRoomId}
                  screenSize={screenSize}
                  hideSide={hideSide}
                  setDimensionFrames={setDimensionFrames}
                  iframeRef={iframeRef}
                  setIframeRef={setIframeRef}
                  setCounterSharedData={setCounterSharedData}
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
                  sharingFile={!!sharingFile}
                  sharingWhiteboard={!!fastboard}
                  isHost={isHost}
                  joinedSharedDim={joinedSharedDim}
                  setJoinedSharedDim={setJoinedSharedDim}
                  sharedDimId={sharedDimId}
                  permissions={permissions}
                  setPermissions={setPermissions}
                  activeBtn={activeBtn}
                  askedForCounter={askedForCounter}
                  setHideSide={setHideSide}
                  setActiveBtn={setActiveBtn}
                  messages={messages}
                  sendMessage={sendMessage}
                  participants={participants}
                  shareWhiteboard={shareWhiteboard}
                  sharedFiles={sharedFiles}
                  setSharedFiles={setSharedFiles}
                  sharingDimId={sharingDimId}
                  fastboard={fastboard}
                  setAskedForCounter={setAskedForCounter}
                  counterFormData={counterFormData}
                  counterSharedData={counterSharedData}
                  localScreenTrack={localScreenTrack}
                  chatRoomId={chatRoomId}
                  screenSize={screenSize}
                  hideSide={hideSide}
                  setDimensionFrames={setDimensionFrames}
                  iframeRef={iframeRef}
                  setIframeRef={setIframeRef}
                  setCounterSharedData={setCounterSharedData}
                />
              ) : !!sharingFile ? (
                <MeetingScreen
                  isMain
                  key={`${sharingFile.id}_file`}
                  screen={sharingFileScreenObj}
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
                  sharingFile={!!sharingFile}
                  sharingWhiteboard={!!fastboard}
                  isHost={isHost}
                  joinedSharedDim={joinedSharedDim}
                  setJoinedSharedDim={setJoinedSharedDim}
                  sharedDimId={sharedDimId}
                  permissions={permissions}
                  setPermissions={setPermissions}
                  setActiveBtn={setActiveBtn}
                  activeBtn={activeBtn}
                  askedForCounter={askedForCounter}
                  setHideSide={setHideSide}
                  messages={messages}
                  sendMessage={sendMessage}
                  participants={participants}
                  shareWhiteboard={shareWhiteboard}
                  sharedFiles={sharedFiles}
                  setSharedFiles={setSharedFiles}
                  sharingDimId={sharingDimId}
                  fastboard={fastboard}
                  setAskedForCounter={setAskedForCounter}
                  counterFormData={counterFormData}
                  counterSharedData={counterSharedData}
                  localScreenTrack={localScreenTrack}
                  chatRoomId={chatRoomId}
                  screenSize={screenSize}
                  hideSide={hideSide}
                  setDimensionFrames={setDimensionFrames}
                  iframeRef={iframeRef}
                  setIframeRef={setIframeRef}
                  setCounterSharedData={setCounterSharedData}
                />
              ) : !!fastboard ? (
                <MeetingScreen
                  isMain
                  key={`${sharedDimId}_whiteboard`}
                  screen={whiteboardScreenObj}
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
                  sharingFile={!!sharingFile}
                  sharingWhiteboard={!!fastboard}
                  isHost={isHost}
                  joinedSharedDim={joinedSharedDim}
                  setJoinedSharedDim={setJoinedSharedDim}
                  sharedDimId={sharedDimId}
                  permissions={permissions}
                  setPermissions={setPermissions}
                  setActiveBtn={setActiveBtn}
                  activeBtn={activeBtn}
                  askedForCounter={askedForCounter}
                  setHideSide={setHideSide}
                  messages={messages}
                  sendMessage={sendMessage}
                  participants={participants}
                  shareWhiteboard={shareWhiteboard}
                  sharedFiles={sharedFiles}
                  setSharedFiles={setSharedFiles}
                  sharingDimId={sharingDimId}
                  fastboard={fastboard}
                  setAskedForCounter={setAskedForCounter}
                  counterFormData={counterFormData}
                  counterSharedData={counterSharedData}
                  localScreenTrack={localScreenTrack}
                  chatRoomId={chatRoomId}
                  screenSize={screenSize}
                  hideSide={hideSide}
                  setDimensionFrames={setDimensionFrames}
                  iframeRef={iframeRef}
                  setIframeRef={setIframeRef}
                  setCounterSharedData={setCounterSharedData}
                />
              ) : deskType === "desk" ? (
                <MeetingScreen
                  isMain
                  key={mainScreen?.screenId}
                  screen={deskScreenObj}
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
                  sharingFile={!!sharingFile}
                  sharingWhiteboard={!!fastboard}
                  isHost={isHost}
                  joinedSharedDim={joinedSharedDim}
                  setJoinedSharedDim={setJoinedSharedDim}
                  sharedDimId={sharedDimId}
                  permissions={permissions}
                  setPermissions={setPermissions}
                  setActiveBtn={setActiveBtn}
                  activeBtn={activeBtn}
                  askedForCounter={askedForCounter}
                  setHideSide={setHideSide}
                  messages={messages}
                  sendMessage={sendMessage}
                  participants={participants}
                  shareWhiteboard={shareWhiteboard}
                  sharedFiles={sharedFiles}
                  setSharedFiles={setSharedFiles}
                  sharingDimId={sharingDimId}
                  fastboard={fastboard}
                  setAskedForCounter={setAskedForCounter}
                  counterFormData={counterFormData}
                  counterSharedData={counterSharedData}
                  localScreenTrack={localScreenTrack}
                  chatRoomId={chatRoomId}
                  screenSize={screenSize}
                  hideSide={hideSide}
                  setDimensionFrames={setDimensionFrames}
                  deskId={meetingId}
                  iframeRef={iframeRef}
                  setIframeRef={setIframeRef}
                  setCounterSharedData={setCounterSharedData}
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
                  sharingFile={!!sharingFile}
                  sharingWhiteboard={!!fastboard}
                  isHost={isHost}
                  joinedSharedDim={joinedSharedDim}
                  setJoinedSharedDim={setJoinedSharedDim}
                  sharedDimId={sharedDimId}
                  permissions={permissions}
                  setPermissions={setPermissions}
                  setActiveBtn={setActiveBtn}
                  activeBtn={activeBtn}
                  askedForCounter={askedForCounter}
                  setHideSide={setHideSide}
                  messages={messages}
                  sendMessage={sendMessage}
                  participants={participants}
                  shareWhiteboard={shareWhiteboard}
                  sharedFiles={sharedFiles}
                  setSharedFiles={setSharedFiles}
                  sharingDimId={sharingDimId}
                  fastboard={fastboard}
                  setAskedForCounter={setAskedForCounter}
                  counterFormData={counterFormData}
                  counterSharedData={counterSharedData}
                  localScreenTrack={localScreenTrack}
                  chatRoomId={chatRoomId}
                  screenSize={screenSize}
                  hideSide={hideSide}
                  setDimensionFrames={setDimensionFrames}
                  iframeRef={iframeRef}
                  setIframeRef={setIframeRef}
                  setCounterSharedData={setCounterSharedData}
                />
              )}
            </Col>
          </Row>
        </Col>

        {!screenSize.xl && (
          <Col xs={24} xl={0}>
            <div className="virtual-support-aside">
              <MeetAsaider
                isHost={isHost}
                chatLoading={!chatRoomId}
                messages={messages}
                sendMessage={sendMessage}
                participants={participants}
                activeBtn={activeBtn}
                setActiveBtn={setActiveBtn}
                SystemMessage={SystemMessage}
                shareWhiteboard={shareWhiteboard}
                permissions={permissions}
                sharedFiles={sharedFiles}
                setSharedFiles={setSharedFiles}
                sharedDimId={sharedDimId}
                sharingDimId={sharingDimId}
                unPublishScreen={unPublishScreen}
                publishScreen={publishScreen}
                sharingScreen={localScreenTrack?.enabled}
                sharingDim={!!sharingDimId}
                sharingFile={!!sharingFile}
                sharingWhiteboard={!!fastboard}
                joinedSharedDim={joinedSharedDim}
                setJoinedSharedDim={setJoinedSharedDim}
                fastboard={fastboard}
                setAskedForCounter={setAskedForCounter}
                counterFormData={counterFormData}
                counterSharedData={counterSharedData}
                dimensionFrames={dimensionFrames}
                iframeRef={iframeRef}
              />
            </div>
          </Col>
        )}
      </Row>
      {!!sharedHolomeetId && (
        <HolomeetDim
          SystemMessage={SystemMessage}
          sharedHolomeetId={sharedHolomeetId}
          isHost={isHost}
        />
      )}
    </>
  );
}
