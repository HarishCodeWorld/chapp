import React, { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled, { keyframes, css } from "styled-components";
import { isMobile } from "../user-list";

const expand = keyframes`
  from {
    width: 40px;
    opacity: 0;
  }
  to {
    width: 200px;
    opacity: 1;
  }
`;

const collapse = keyframes`
  from {
    width: 200px;
    opacity: 1;
  }
  to {
    width: 40px;
    opacity: 0;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  transition: width 0.3s;
`;

const AnimatedInput = styled(Input)`
  ${({ isExpanded }) =>
    isExpanded
      ? css`
          animation: ${expand} 0.3s forwards;
        `
      : css`
          animation: ${collapse} 0.3s forwards;
        `}
  border-radius: 20px;
`;

const SearchTag = ({ placeholder, searchTerm, setSearchTerm, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSearch = () => {
    setIsExpanded((prev) => !prev);
    setSearchTerm("");
  };

  return (
    <SearchWrapper
      style={{
        width: isExpanded ? (isMobile ? "80vw" : "90%") : "40px",
        color: color || "white",
      }}
    >
      {isExpanded ? (
        <AnimatedInput
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={toggleSearch}
          isExpanded={isExpanded}
          prefix={<SearchOutlined />}
          autoFocus
        />
      ) : (
        <SearchOutlined
          style={{ fontSize: "22px", cursor: "pointer" }}
          onClick={toggleSearch}
        />
      )}
    </SearchWrapper>
  );
};

export default SearchTag;
