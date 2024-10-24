import styled from "styled-components";

export const TypingLoaderContainer = styled.div`
  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    background: #f6f7f8;
  }

  div#wave {
    position: relative;
    .dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      margin-right: 7px;
      background: #3c3f58;
      animation: wave 1.3s linear infinite;

      &:nth-child(2) {
        animation-delay: -1.1s;
      }

      &:nth-child(3) {
        animation-delay: -0.9s;
      }
    }
  }

  @keyframes wave {
    0%,
    60%,
    100% {
      transform: initial;
    }

    30% {
      transform: translateY(-15px);
    }
  }
`;
