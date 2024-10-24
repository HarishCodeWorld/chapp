import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Message, { MessageBubble } from "../message-item";
import InputBar from "../input-bar";
import axiosInstance from "../../axios";
import { useSocket } from "../../socket-connection-hook";
import { Avatar } from "antd";
import { ArrowLeftOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { WrapperWithLoader } from "../loading-wrapper";
import TypingLoader from "../typing-loader";
import { filterArrayByAllValues, isMobile } from "../user-list";
import SearchTag from "../search-container";
import { decryptText, encryptText } from "../../utils/crypt";

const ChatWindowContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: calc(100vw - 400px);
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const UserHeader = styled.div`
  width: -webkit-fill-available;
  @media (max-width: 768px) {
    width: 100%;
  }
  height: 38px;
  text-align: left;
  display: flex;
  align-items: center;
  padding: 25px 20px;
  border-bottom: 2px solid #aaaaaa;
  top: 0px;
  justify-content: space-between;
  position: fixed;
  z-index: 9;
  background-color: white;
  /* background-color: #8b96f9; */
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 20px;
  width: 50%;
`;

export const SearchHeader = styled.div`
  width: 100%;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 20px;
  width: 50%;
  justify-content: flex-end;
`;

const MessagesContainer = styled.div`
  /* flex-grow: 1; */
  padding: 20px;
  overflow-y: auto;
  /* margin-top: 55px; */
  z-index: 8;
  margin-bottom: 60px;
  height: calc(100vh - 90px);
  background-color: #f2f2f2;
`;

const StatusMessage = styled.div`
  color: ${(props) => (props.error ? "red" : "green")};
  padding: 10px;
  text-align: center;
`;

const ChatWindow = ({
  receiverId,
  receiverName,
  receiverNumber,
  setMessages,
  messages,
  typingUsers,
}) => {
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const [statusMessage, setStatusMessage] = useState("");
  const socket = useSocket();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [backUpMessages, setBackUpMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => scrollToBottom(), 100);
    return () => clearTimeout(timeout);
  }, [messages, typingUsers]);

  useEffect(() => {
    if (searchTerm != "") {
      setMessages(filterArrayByAllValues(backUpMessages, searchTerm));
    } else setMessages(backUpMessages);
  }, [searchTerm]);

  useEffect(() => {
    setLoading(true);
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(
          `/chat/get-messages/${userId}/${receiverId}`
        );

        if (response.status == 200) {
          setMessages(response.data);
          setBackUpMessages(response.data);
        }
      } catch (error) {
        setStatusMessage(
          error.response?.data?.message || "Error loading messages."
        );
      } finally {
        setLoading(false);
      }
    };
    if (receiverId) {
      fetchMessages();
    }
  }, [userId, accessToken, receiverId]);

  const sendMessage = (messageText) => {
    console.log({ socket });
    const encMessage = encryptText(messageText, receiverId);

    if (socket && messageText?.trim()) {
      const messageData = {
        // content: messageText,
        content: encMessage,
        senderId: userId,
        recipientId: receiverId,
        conversationId: "",
        receiverNumber: receiverNumber,
        senderName: localStorage.getItem("userName"),
      };

      console.log({ messageData });

      socket.emit("send_message", messageData);

      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, createdAt: new Date().toISOString(), sender: "You" },
      ]);
      setBackUpMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, createdAt: new Date().toISOString(), sender: "You" },
      ]);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result;
      const messageData = {
        image: base64Image,
        content: " ",
        senderId: userId,
        recipientId: receiverId,
        conversationId: "",
        receiverNumber: receiverNumber,
        senderName: localStorage.getItem("userName"),
        type: "image",
      };
      socket.emit("send_image", messageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, createdAt: new Date().toISOString(), sender: "You" },
      ]);
      setBackUpMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, createdAt: new Date().toISOString(), sender: "You" },
      ]);
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleTyping = (messageText) => {
    if (socket && messageText === "") {
      const messageData = {
        senderId: userId,
        recipientId: receiverId,
        receiverNumber: receiverNumber,
        senderName: localStorage.getItem("userName"),
      };

      socket.emit("stop_typing", messageData);
      return;
    }
    if (socket) {
      const messageData = {
        senderId: userId,
        recipientId: receiverId,
        receiverNumber: receiverNumber,
        senderName: localStorage.getItem("userName"),
      };

      socket.emit("typing", messageData);
    }
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result;
      const messageData = {
        image: base64Image,
        content: " ",
        senderId: userId,
        recipientId: receiverId,
        conversationId: "",
        receiverNumber: receiverNumber,
        senderName: localStorage.getItem("userName"),
        type: "image",
      };

      // Emit the captured image over the socket
      socket.emit("send_image", messageData);

      // Update state with the new message
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, createdAt: new Date().toISOString(), sender: "You" },
      ]);
      setBackUpMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData, createdAt: new Date().toISOString(), sender: "You" },
      ]);
    };

    if (file) reader.readAsDataURL(file);
  };

  console.log({ messages });

  return (
    <WrapperWithLoader
      isLoading={loading}
      loaderComponent={<TypingLoader />}
      text={""}
    >
      <ChatWindowContainer>
        <UserHeader>
          <HeaderLeft>
            {isMobile && (
              <ArrowLeftOutlined
                onClick={() => {
                  navigate(-1);
                }}
              />
            )}

            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
            <h4>{receiverName}</h4>
          </HeaderLeft>
          <HeaderRight>
            {/* <SearchTag
              placeholder={"Search..."}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              color="#525cb1"
            /> */}
          </HeaderRight>
        </UserHeader>
        {searchTerm && (
          <UserHeader
            style={{ background: "#525cb1", color: "white", top: "53px" }}
          >
            {messages?.length === 0 ? (
              <div>
                No result found for : <u>{searchTerm}</u>
              </div>
            ) : (
              <div>
                Search result for: <u>{searchTerm}</u>{" "}
              </div>
            )}

            <div>
              <CloseCircleFilled onClick={() => setSearchTerm("")} />
            </div>
          </UserHeader>
        )}

        <MessagesContainer style={{ marginTop: searchTerm ? "106px" : "53px" }}>
          {messages?.map((msg, index) => (
            <Message
              key={index}
              // text={decryptText(msg.content, "test")}
              text={msg.content}
              sender={msg.senderId}
              time={msg.createdAt}
              image={msg?.image}
              type={msg?.type}
              receiverId={msg?.recipientId}
            />
          ))}
          {statusMessage && messages?.length === 0 && (
            <StatusMessage error={statusMessage.includes("Error")}>
              {statusMessage}
            </StatusMessage>
          )}
          {typingUsers.includes(receiverId) && (
            <MessageBubble
              style={{
                padding: "10px 10px 10px 15px",
                width: "75px",
                textAlign: "center",
              }}
              isUser={false}
            >
              <TypingLoader />
            </MessageBubble>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputBar
          sendMessage={sendMessage}
          handleImageUpload={handleImageUpload}
          handleTyping={handleTyping}
          handleCameraCapture={handleCameraCapture}
        />
      </ChatWindowContainer>
    </WrapperWithLoader>
  );
};

export default ChatWindow;
