import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import { Avatar } from "antd";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        "/auth/login",
        { phoneNumber: phone, password: password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (response.status !== 200) {
        setError(response.message);
      } else {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("phoneNumber", data.phoneNumber);
        localStorage.setItem("userName", data.name);

        navigate("/");
      }
    } catch (err) {
      console.log({ err });
      setError(err?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          color: "white",
        }}
      >
        <div>
          <Avatar style={{width: "150px", height: "auto"}} src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
        </div>
        <div>
          <h1>ChAPP</h1>
        </div>
      </div>
      <FormWrapper>
        <Title>Login</Title>
        <Form onSubmit={handleLogin}>
          <InputWrapper>
            <Input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </InputWrapper>
          {error && <Error>{error}</Error>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader /> : "Login"}
          </Button>
        </Form>
        <Text>
          Don't have an account? <Link href="/sign-up">Sign up</Link>
        </Text>
      </FormWrapper>
    </Container>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Loader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4c7cf5;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: ${spin} 1s linear infinite;
  margin: auto;
`;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(135deg, #4c7cf5, #3c3f58);
  gap: 30px;
`;

const FormWrapper = styled.div`
  background: #fff;
  padding: 40px;
  width: 400px;
  border-radius: 10px;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px;
  background: #3c3f58;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    background: #6b6b7e;
    cursor: not-allowed;
  }
`;

const Text = styled.p`
  text-align: center;
  margin-top: 10px;
`;

const Link = styled.a`
  color: #4c7cf5;
  cursor: pointer;
`;

const Error = styled.p`
  color: red;
  text-align: center;
`;

export default Login;
