import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CustomModal, {
  Button,
  ButtonContainer,
  Input,
  ModalHeader,
} from "../custom-modal";
import {
  LeftContainer,
  LogoutContainer,
  UserItem,
  UserItemOne,
  UserListContainer,
  UserName,
} from "./style";
import axiosInstance from "../../axios";
import { Badge, Divider } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TypingLoader from "../typing-loader";
import SearchTag from "../search-container";
import { reverseArray, sortContactsByPriority } from "./helper";
import { Loader } from "../login";

export const filterArrayByAllValues = (data, searchTerm) => {
  if (!searchTerm) return data;

  const lowercasedTerm = searchTerm.toLowerCase();

  return data.filter((obj) =>
    Object.values(obj).some(
      (value) =>
        value && value.toString().toLowerCase().includes(lowercasedTerm)
    )
  );
};

export const isMobile = window.innerWidth <= 768 ? true : false;
let contactsBackUp = [];

const UserList = ({
  setSelectedUser,
  selectedUser,
  newMessageArrayIds,
  typingUsers,
  setNewMessageArrayIds,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [contacts, setContacts] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const getContacts = async () => {
    try {
      const response = await axiosInstance.get(`/user/get-contacts/${userId}`);
      if (response.status === 200) {
        setContacts(response.data.contacts);
        contactsBackUp = response.data.contacts;
      } else {
        setError("Failed to fetch contacts.");
      }
    } catch (error) {
      setError("Error fetching contacts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    if (searchTerm != "") {
      setContacts(filterArrayByAllValues(contacts, searchTerm));
    } else setContacts(contactsBackUp);
  }, [searchTerm]);

  useEffect(() => {
    const handlePopState = (event) => {
      const confirmLeave = window.confirm("Are you sure you want to go back?");
      if (confirmLeave) {
      } else {
        event.preventDefault();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    const sortedContacts = sortContactsByPriority(
      contacts,
      reverseArray(newMessageArrayIds)
    );
    setContacts([...sortedContacts]);
  }, [newMessageArrayIds]);

  const handleAddContact = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewPhoneNumber("");
    setStatusMessage("");
  };

  const handleSaveContact = async () => {
    setIsLoading(true);
    if (!newPhoneNumber) {
      setStatusMessage("Phone number cannot be empty.");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/add-contact", {
        userId,
        contactPhoneNumber: newPhoneNumber,
      });

      if (response.status === 200) {
        setStatusMessage("Contact added successfully!");
        getContacts();
        handleCloseModal();
      } else {
        setStatusMessage("Failed to add contact.");
      }
    } catch (error) {
      setStatusMessage(error.response?.data?.message || "Server error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickContact = (contact) => {
    console.log("inside handle click...");
    const flirtedNewMessageArrayIds = newMessageArrayIds.filter(
      (item) => item !== contact?._id
    );
    setNewMessageArrayIds(flirtedNewMessageArrayIds);
    console.log({ isMobile });
    if (isMobile) {
      navigate("/chat", { state: contact });
    } else {
      setSelectedUser(contact);
    }
  };

  return (
    <LeftContainer>
      <UserListContainer>
        <UserItemOne key={"add-contact"}>
          <UserName style={{ fontSize: "24px" }} onClick={handleAddContact}>
            <Button
              style={{
                padding: "5px 15px",
                color: "#525cb1",
                fontWeight: "bold",
              }}
            >
              +
            </Button>
          </UserName>
          <SearchTag
            placeholder={"Search Contact"}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </UserItemOne>

        {loading ? (
          <p>Loading contacts...</p>
        ) : contacts?.length > 0 ? (
          contacts?.map((contact) => (
            <UserItem
              key={contact?._id}
              onClick={() => handleClickContact(contact)}
              style={{
                background: contact?._id === selectedUser?._id ? "#525cb1" : "",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <UserName>{contact?.name}</UserName>
                <div style={{ display: "flex", gap: "5px" }}>
                  {typingUsers.includes(contact?._id) && (
                    <div style={{ width: "50px" }}>
                      <TypingLoader />
                    </div>
                  )}
                  {newMessageArrayIds?.includes(contact?._id) &&
                  selectedUser?._id !== contact?._id ? (
                    <Badge count={"1"} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </UserItem>
          ))
        ) : (
          <NoContactsMessage>No contacts found</NoContactsMessage>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
      </UserListContainer>

      <LogoutContainer
        onClick={() => {
          navigate("/login");
          localStorage.clear();
        }}
      >
        <Divider style={{ background: "white" }} />

        <div>
          <LogoutOutlined /> &nbsp; logout
        </div>
      </LogoutContainer>
      <CustomModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalHeader>Add New Contact</ModalHeader>
        <Input
          type="text"
          placeholder="Enter phone number"
          value={newPhoneNumber}
          onChange={(e) => setNewPhoneNumber(e.target.value)}
        />
        <ButtonContainer>
          <Button primary onClick={handleSaveContact} disabled={isLoading}>
            {isLoading ? <Loader /> : "Save"}
          </Button>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </ButtonContainer>
        {statusMessage && <StatusMessage>{statusMessage}</StatusMessage>}{" "}
      </CustomModal>
    </LeftContainer>
  );
};

export default UserList;

const NoContactsMessage = styled.p`
  text-align: center;
  color: #ff6347;
  font-size: 18px;
  font-weight: bold;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: red;
  font-size: 16px;
`;

const StatusMessage = styled.p`
  text-align: center;
  color: green;
  font-size: 16px;
`;
