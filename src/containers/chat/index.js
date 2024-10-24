import React from "react";
import { useLocation } from "react-router-dom";
import { Home } from "../home";
const ChatHoc = () => {
  const location = useLocation();
  const contact = location.state;
  return (
    <div>
      <Home selectedUserProp={contact} />
    </div>
  );
};

export default ChatHoc;
