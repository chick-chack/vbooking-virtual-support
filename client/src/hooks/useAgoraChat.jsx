import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import AgoraChat from "agora-chat";
import clone from "clone";

import SocialEventService from "services/social-event.service";
import CommonService from "services/common.service";
import UserContext from "context/userContext";
import logo from "assets/images/logo.png";
import { Col, Image, Row } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const TOKEN_EXPIRY = 8 * 60 * 60; // 8 hours
const PAGE_SIZE = 50;

export const AgoraChatContext = createContext(null);

export const useAgoraChat = () => useContext(AgoraChatContext);

export function AgoraChatContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  const { user } = useContext(UserContext);

  const userRef = useRef(user);
  const agoraChatClient = useRef(
    new AgoraChat.connection({
      appKey: process.env.REACT_APP_AGORA_APP_KEY,
      delivery: true,
    }),
  );

  const unreadNo = useMemo(
    () =>
      conversations.reduce((prev, curr) => prev.unreadNo + curr.unreadNo, {
        unreadNo: 0,
      }),
    [conversations],
  );

  const fetchAndPopulateConversations = useCallback(async () => {
    try {
      const conversationList =
        await agoraChatClient.current.getConversationlist();

      // filter out chat rooms and groups
      conversationList.data.channel_infos =
        conversationList.data.channel_infos.filter(
          (channel) => channel.lastMessage?.chatType === "chat",
        );

      const secondPartiesIds = conversationList.data.channel_infos.map(
        (channel) => {
          let secondPartyId;

          if (
            channel.lastMessage?.chatType !== "chat" ||
            Number(channel.lastMessage?.from) === userRef.current.id
          ) {
            secondPartyId = Number(channel.lastMessage?.to);
          } else {
            secondPartyId = Number(channel.lastMessage?.from);
          }

          return secondPartyId;
        },
      );

      const secondParties = await CommonService.getUserList({
        id: secondPartiesIds,
      });

      const _conversations = conversationList.data.channel_infos.map(
        (channel) => {
          let secondPartyId;
          let chatType;

          if (
            channel.lastMessage?.chatType !== "chat" ||
            Number(channel.lastMessage?.from) === userRef.current.id
          ) {
            secondPartyId = Number(channel.lastMessage?.to);
          } else {
            secondPartyId = Number(channel.lastMessage?.from);
          }

          if (channel.lastMessage?.chatType === "chat") {
            chatType = "singleChat";
          } else if (channel.lastMessage?.chatType === "groupchat") {
            chatType = "groupChat";
          } else {
            chatType = "chatRoom";
          }

          return {
            chatType: chatType,
            unreadNo: channel.unread_num,
            secondParty: secondParties.find((e) => e.id === secondPartyId),
            messages: [channel.lastMessage],
            lastMessage: channel.lastMessage,
            fetchedAll: false,
          };
        },
      );

      setConversations(_conversations);
    } catch (error) {
      console.log("Error fetching conversations: ", error);
    }
  }, []);

  const fetchConversationHistory = useCallback(
    async (
      targetId,
      chatType,
      cursor = -1,
      pageSize = PAGE_SIZE,
      searchDirection = "up",
    ) => {
      try {
        const history = await agoraChatClient.current.getHistoryMessages({
          targetId,
          chatType,
          cursor,
          pageSize,
          searchDirection,
        });

        setConversations((prev) => {
          const _conversations = clone(prev);
          const idx = _conversations.findIndex(
            (conv) => conv.secondParty.id === Number(targetId),
          );

          if (idx > -1) {
            if (history.messages?.length) {
              _conversations[idx].messages = [
                ..._conversations[idx].messages,
                ...history.messages,
              ].sort((a, b) => a.time - b.time);
            } else {
              _conversations[idx].fetchedAll = true;
            }
          }

          return _conversations;
        });
      } catch (error) {
        console.log(`Error fetching conversation history: ${error.message}`);
      }
    },
    [],
  );

  const sendTxtMessage = useCallback(async (chatType, to, msg) => {
    try {
      if (agoraChatClient.current.isOpened()) {
        const msgObj = AgoraChat.message.create({
          chatType,
          type: "txt",
          to,
          msg,
          from: `${userRef.current.id}`,
        });

        const { serverMsgId } = await agoraChatClient.current.send(msgObj);

        setConversations((prev) => {
          const _conversations = clone(prev);
          const idx = _conversations.findIndex(
            (conv) => conv.secondParty.id === Number(msgObj.to),
          );

          if (idx > -1) {
            _conversations[idx].messages.push({ ...msgObj, id: serverMsgId });
            _conversations[idx].lastMessage = { ...msgObj, id: serverMsgId };
          }

          return _conversations;
        });
      }
    } catch (error) {
      console.log(`Error sending message: ${error.message}`);
    }
  }, []);

  const startNewConversation = useCallback(
    async (id, fullName, profileImage) => {
      setConversations((prev) => [
        {
          chatType: "singleChat",
          unreadNo: 0,
          secondParty: {
            id,
            fullName,
            profileImage,
          },
          messages: [],
          lastMessage: null,
          fetchedAll: false,
        },
        ...prev,
      ]);
    },
    [],
  );

  const addReaction = useCallback(
    async (messageId, reaction, secondPartyId) => {
      try {
        await agoraChatClient.current.addReaction({ messageId, reaction });

        setConversations((prev) => {
          const _conversations = clone(prev);
          const convIdx = _conversations.findIndex(
            (conv) => conv.secondParty.id === Number(secondPartyId),
          );
          if (convIdx > -1) {
            const msgIdx = _conversations[convIdx].messages.findIndex(
              (message) => message.id === messageId,
            );

            if (msgIdx > -1) {
              const reactionIdx = _conversations[convIdx].messages[
                msgIdx
              ]?.reactions?.findIndex((r) => r.reaction === reaction);

              if (
                !_conversations[convIdx].messages[msgIdx]?.reactions ||
                reactionIdx < 0
              ) {
                _conversations[convIdx].messages[msgIdx].reactions = [
                  { count: 1, reaction },
                ];
              } else {
                _conversations[convIdx].messages[msgIdx].reactions[
                  reactionIdx
                ].count =
                  _conversations[convIdx].messages[msgIdx]?.reactions[
                    reactionIdx
                  ].count + 1;
              }
            }
          }
          return _conversations;
        });
      } catch (error) {
        console.log("Error adding reaction: ", error);
      }
    },
    [],
  );

  useEffect(() => {
    (async () => {
      try {
        const agoraRte = await SocialEventService.getAgoraRteTokens(
          0,
          "PUBLISHER",
          userRef.current.id,
          TOKEN_EXPIRY,
        );

        await agoraChatClient.current.open({
          user: `${userRef.current.id}`,
          agoraToken: agoraRte.chatToken,
        });

        await fetchAndPopulateConversations();

        agoraChatClient.current.removeEventHandler("connection&message");
        agoraChatClient.current.addEventHandler("connection&message", {
          onConnected: async () => {
            console.info("Chat Connected");
          },
          onDisconnected: () => {
            console.info("Chat Disconnedted");
          },
          onTextMessage: (message) => {
            setConversations((prev) => {
              const _conversations = clone(prev);
              const idx = _conversations.findIndex(
                (conv) => conv.secondParty.id === Number(message.from),
              );

              if (idx > -1) {
                _conversations[idx].messages.push(message);
                _conversations[idx].lastMessage = message;
              }

              return _conversations;
            });
          },
          onReactionChange: (reactedMessage) => {
            let secondPartyId;

            if (
              reactedMessage.chatType !== "singleChat" ||
              Number(reactedMessage.from) === userRef.current.id
            ) {
              secondPartyId = Number(reactedMessage.to);
            } else {
              secondPartyId = Number(reactedMessage.from);
            }

            setConversations((prev) => {
              const _conversations = clone(prev);
              const convIdx = _conversations.findIndex(
                (conv) => conv.secondParty.id === Number(secondPartyId),
              );
              if (convIdx > -1) {
                const msgIdx = _conversations[convIdx].messages.findIndex(
                  (message) => message.id === reactedMessage.messageId,
                );

                if (msgIdx > -1) {
                  _conversations[convIdx].messages[msgIdx].reactions =
                    reactedMessage.reactions;
                }
              }
              return _conversations;
            });
          },
          onDeliveredMessage: (deliveredMessage) => {
            // console.log("deliveredMessage", deliveredMessage);
            // todo: search through all messages not conversation based
            // setConversations((prev) => {
            //   const _conversations = clone(prev);
            //   const convIdx = _conversations.findIndex(
            //     (conv) => conv.secondParty.id === Number(deliveredMessage.from),
            //   );
            //   if (convIdx > -1) {
            //     const msgIdx = _conversations[convIdx].messages.findIndex(
            //       (message) => message.id === deliveredMessage.mid,
            //     );
            //     if (msgIdx > -1) {
            //       _conversations[convIdx].messages[msgIdx].delivered = true;
            //     }
            //   }
            //   return _conversations;
            // });
          },
          onReceivedMessage: (receivedMessage) => {
            // console.log("receivedMessage", receivedMessage);
            // todo: search through all messages not conversation based
            // setConversations((prev) => {
            //   const _conversations = clone(prev);
            //   const convIdx = _conversations.findIndex(
            //     (conv) => conv.secondParty.id === Number(receivedMessage.to),
            //   );
            //   if (convIdx > -1) {
            //     const msgIdx = _conversations[convIdx].messages.findIndex(
            //       (message) => message.id === receivedMessage.mid,
            //     );
            //     if (msgIdx > -1) {
            //       _conversations[convIdx].messages[msgIdx].received = true;
            //     }
            //   }
            //   return _conversations;
            // });
          },
          onReadMessage: (readMessage) => {
            console.log("readMessage", readMessage);
          },
          onError: (error) => {
            console.log("on error\n", error);
          },
        });

        setLoading(false);
      } catch (error) {
        console.log("Error initializing chat client: ", error);
      }
    })();
  }, [fetchAndPopulateConversations]);

  // #region Update Refs
  useEffect(() => {
    userRef.current = user;
  }, [user]);
  // #endregion Update Refs

  const contextValue = useMemo(
    () => ({
      agoraChatClient: agoraChatClient.current,
      conversations,
      unreadNo,
      sendTxtMessage,
      fetchConversationHistory,
      startNewConversation,
      addReaction,
    }),
    [
      conversations,
      unreadNo,
      sendTxtMessage,
      fetchConversationHistory,
      startNewConversation,
      addReaction,
    ],
  );

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
    <AgoraChatContext.Provider value={contextValue}>
      {children}
    </AgoraChatContext.Provider>
  );
}
