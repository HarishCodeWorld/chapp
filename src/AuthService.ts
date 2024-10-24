import axios from 'axios';
import axiosInstance from './axios';

const login = async (phoneNumber, password) => {
  const response = await axiosInstance.post('/auth/login', { phoneNumber, password });
  const { accessToken, refreshToken } = response.data;
  
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  
  return response.data;
};

const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export { login, getAccessToken };
