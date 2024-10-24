import React from "react";
import { TypingLoaderContainer } from "./style";

const TypingLoader = () => {
  return (
    <TypingLoaderContainer>
      <div id="wave">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </TypingLoaderContainer>
  );
};

export default TypingLoader;
