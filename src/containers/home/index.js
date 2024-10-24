import React, { useState, useEffect } from "react";
import UserList, { isMobile } from "../../components/user-list";
import { HomeContainer } from "./style";
import ChatWindow from "../../components/chat-window";
import { useSocket } from "../../socket-connection-hook";
import { CommentOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import styled from "styled-components";
import { useNotification } from "../../components/notification-browser";
import { decryptText } from "../../utils/crypt";

const EmptyWrapper = styled.div`
  width: calc(100vw - 400px);
  @media (max-width: 768px) {
    width: 100%;
  }
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const Home = ({ selectedUserProp }) => {
  const socket = useSocket();
  const [selectedUser, setSelectedUser] = useState(
    selectedUserProp || undefined
  );
  const [messages, setMessages] = useState([]);
  const [newMessageArrayIds, setNewMessageArrayIds] = useState([]);
  const { showNotification } = useNotification();
  const [typingUsers, setTypingUsers] = useState([]);

  // console.log({ showNotification });

  useEffect(() => {
    if (socket) {
      const phoneNumber = localStorage.getItem("phoneNumber");
      socket.on(phoneNumber, (message) => {
        const tempMessageArrayIds = [...newMessageArrayIds];
        const filteredTypingUsersTemp = typingUsers.filter(
          (id) => id !== message.senderId
        );

        setTypingUsers([...filteredTypingUsersTemp]);

        showNotification(`${message.senderName}`, {
          body: `${decryptText(
            message.content,
            localStorage.getItem("userId")
          )}`,
          icon: "https://api.dicebear.com/7.x/miniavs/svg?seed=40",
        });
        tempMessageArrayIds.push(message?.senderId);
        setNewMessageArrayIds([...tempMessageArrayIds]);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on(`image_${phoneNumber}`, (message) => {
        const tempMessageArrayIds = [...newMessageArrayIds];
        showNotification(`${message.senderName}`, {
          body: `Sent a Image`,
          icon: "https://api.dicebear.com/7.x/miniavs/svg?seed=40",
        });
        tempMessageArrayIds.push(message?.senderId);

        setNewMessageArrayIds([...tempMessageArrayIds]);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on(`typing_${phoneNumber}`, (message) => {
        const tempArray = [...typingUsers];
        if (!tempArray.includes(message?.senderId)) {
          tempArray.push(message?.senderId);
        }
        setTypingUsers([...tempArray]);
      });

      socket.on(`stop_typing_${phoneNumber}`, (message) => {
        const tempArray = [...typingUsers];

        const updatedArray = tempArray.filter(
          (userId) => userId !== message.senderId
        );

        setTypingUsers(updatedArray);
      });
    }
  }, [socket]);

  return (
    <HomeContainer>
      {(!isMobile || (isMobile && !selectedUser)) && (
        <UserList
          setSelectedUser={setSelectedUser}
          selectedUser={selectedUser}
          newMessageArrayIds={newMessageArrayIds}
          typingUsers={typingUsers}
          setNewMessageArrayIds={setNewMessageArrayIds}
        />
      )}

      {(!isMobile || (isMobile && selectedUser)) && (
        <>
          {selectedUser?._id ? (
            <ChatWindow
              receiverId={selectedUser._id}
              receiverName={selectedUser.name}
              receiverNumber={selectedUser.phoneNumber}
              messages={messages}
              setMessages={setMessages}
              typingUsers={typingUsers}
            />
          ) : (
            <EmptyWrapper>
              <div>Click on a contact to start chatting..</div>
            </EmptyWrapper>
          )}
        </>
      )}
    </HomeContainer>
  );
};
