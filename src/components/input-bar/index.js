import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  SendOutlined,
  PictureOutlined,
  CameraOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import EmojiPicker from "emoji-picker-react"; // Import the Emoji Picker component
import { isMobile } from "../user-list";

const InputContainer = styled.div`
  padding: 10px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  border-top: 2px solid #aaaaaa;
  position: fixed;
  bottom: 0;
  width: -webkit-fill-available;
  z-index: 8;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  padding: 5px;
  font-size: 20px;
  color: #525cb1;
  position: relative;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: none;
  outline: none;
  font-size: 16px;
  border-radius: 5px;
`;

const SendButton = styled.button`
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #525cb1;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  bottom: 50px;
  right: 0;
  z-index: 10;
`;

const InputBar = ({
  sendMessage,
  handleImageUpload,
  handleCameraCapture,
  handleTyping,
}) => {
  const [message, setMessage] = useState("");
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false); // State for emoji picker visibility
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);
  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
      setIsEmojiPickerVisible(false);
      inputRef.current.focus(); 
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setIsEmojiPickerVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // Listen for clicks
    return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup on unmount
  }, []);

  // const checkCameraPermission = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     stream.getTracks().forEach((track) => track.stop());
  //     cameraInputRef.current.click();
  //   } catch (error) {
  //     console.error("Camera permission denied or not available:", error);
  //     alert("Please allow camera access to use the camera feature.");
  //   }
  // };
  const checkCameraPermission = async () => {
    // Detect iPhone or Android based on userAgent
    const isIPhone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    // Check if getUserMedia is available
    const getMedia = navigator.mediaDevices?.getUserMedia;

    if (!getMedia) {
      alert(
        "Camera is not supported on this browser or device. " +
          (isIPhone
            ? "Please try opening the app in Safari or check your browser settings."
            : "Please try using Chrome or check your app permissions.")
      );
      return;
    }

    try {
      // Try accessing the camera
      const stream = await getMedia({ video: true });

      // Stop the stream immediately to release the camera
      stream.getTracks().forEach((track) => track.stop());

      // Open the camera input (if successful)
      cameraInputRef.current.click();
    } catch (error) {
      console.error("Error accessing the camera:", error);

      // Handle permission errors with platform-specific instructions
      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        if (isIPhone) {
          alert(
            "To enable camera access on your iPhone:\n\n" +
              "1. Open the Settings app.\n" +
              "2. Scroll down and tap 'Privacy & Security'.\n" +
              "3. Tap 'Camera'.\n" +
              "4. Enable camera access for your app."
          );
        } else if (isAndroid) {
          alert(
            "To enable camera access on your Android device:\n\n" +
              "1. Open the Settings app.\n" +
              "2. Tap 'Apps & Notifications' or 'App Management'.\n" +
              "3. Find your app and tap 'Permissions'.\n" +
              "4. Enable 'Camera' permission."
          );
        } else {
          alert("Please enable camera access in your device settings.");
        }
      } else if (error.name === "NotFoundError") {
        alert("No camera found on your device.");
      } else {
        alert(
          "Unable to access the camera. Please try again or check your settings."
        );
      }
    }
  };

  const handleCameraClick = () => {
    checkCameraPermission();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(e);
    }
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerVisible((prev) => !prev);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    // setIsEmojiPickerVisible(false); // Close the picker after selection
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents line break on mobile devices
      handleSend();
    }
  };

  return (
    <InputContainer>
      {/* Trigger File Upload */}
      <IconButton onClick={triggerFileUpload}>
        <PictureOutlined />
      </IconButton>
      <HiddenFileInput
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Trigger Camera Capture */}
      {isMobile && (
        <>
          <IconButton onClick={handleCameraClick}>
            <CameraOutlined />
          </IconButton>
          <HiddenFileInput
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={handleCameraCapture}
          />
        </>
      )}

      {/* Text Input */}
      <Input
        type="text"
        ref={inputRef}
        placeholder="Type a message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping(e.target.value);
        }}
        onKeyDown={handleKeyDown} // Listen for Enter key press
      />

      {/* Emoji Picker Button */}
      <IconButton onClick={toggleEmojiPicker}>
        <SmileOutlined />
      </IconButton>
      {isEmojiPickerVisible && (
        <EmojiPickerContainer ref={emojiPickerRef}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </EmojiPickerContainer>
      )}

      {/* Send Button */}
      <SendButton onClick={handleSend}>
        <SendOutlined />
      </SendButton>
    </InputContainer>
  );
};

export default InputBar;
