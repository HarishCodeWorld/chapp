import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axiosInstance from "../../axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    } else {
      setError("");
    }

    setLoading(true); // Start loader

    try {
      const response = await axiosInstance.post(
        "/auth/sign-up",
        {
          name: name,
          phoneNumber: phone,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Signup successful! Redirecting to Login page...");
        setError("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError("Signup failed");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false); // Stop loader after completion
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Sign Up</Title>
        <Form onSubmit={handleSignup}>
          <InputWrapper>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
            />
          </InputWrapper>
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
          <InputWrapper>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </InputWrapper>
          {error && <Error>{error}</Error>}
          {success && <Success>{success}</Success>}
          <Button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </Form>
      </FormWrapper>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4c7cf5, #3c3f58);
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
  background-color: #3c3f58;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const Error = styled.p`
  color: red;
  text-align: center;
`;

const Success = styled.p`
  color: green;
  text-align: center;
`;

export default Signup;
