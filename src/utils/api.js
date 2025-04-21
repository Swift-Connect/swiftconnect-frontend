import axios from 'axios';

const api = axios.create({
  baseURL: 'https://swiftconnect-backend.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('access_token') : ''}`
  }
});

export const fetchWithAuth = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const postWithAuth = async (url, data) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default api;