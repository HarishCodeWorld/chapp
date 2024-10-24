import styled from "styled-components";

export const LeftContainer = styled.div`
  width: 400px;
  padding: 20px;
  /* mobile */
  @media (max-width: 768px) {
    width: 100%;
  }

  display: flex;
  justify-content: space-between;
  flex-direction: column;
  background-color: #3c3f58;
`;

export const LogoutContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: white;
  cursor: pointer;
`;

export const UserListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #fff;
  height: 100vh;
  overflow: auto;
`;

export const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4b4f6d;
  padding: 24px 16px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #525cb1;
  }
`;

export const UserItemOne = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4b4f6d;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
`;

export const UserName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

export const UserPhone = styled.div`
  font-size: 14px;
  color: #b2b3bd;
`;
