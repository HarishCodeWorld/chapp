import React from "react";
import styled from "styled-components";

export const WrapperWithLoader = ({
  children,
  isLoading,
  loaderComponent,
  text,
}) => {
  if (!isLoading) {
    return children;
  }
  return (
    <Wrapper>
      <LoaderContainer>
        <div>{loaderComponent}</div>
        <div>
          <i>{text}</i>
        </div>
      </LoaderContainer>
      <ContentWrapper>{children}</ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: calc(100vw - 400px);
  @media (max-width: 768px) {
    width: 100%;
  }
  height: 100%;
  overflow: hidden;
`;

const LoaderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 999;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;
