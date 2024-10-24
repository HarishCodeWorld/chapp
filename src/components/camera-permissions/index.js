import React from "react";
import styled from "styled-components";
import { CameraOutlined } from "@ant-design/icons";

const Button = styled.button`
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #525cb1;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CameraSettingsButton = () => {
  const handleSettingsClick = () => {
    alert(
      "To enable camera access on your iPhone:\n\n" +
      "1. Open the Settings app.\n" +
      "2. Scroll down and tap on 'Privacy & Security'.\n" +
      "3. Tap on 'Camera'.\n" +
      "4. Find your app in the list and toggle the switch to enable camera access."
    );
  };

  return (
    <Button onClick={handleSettingsClick}>
      <CameraOutlined /> Enable Camera in Settings
    </Button>
  );
};

export default CameraSettingsButton;
