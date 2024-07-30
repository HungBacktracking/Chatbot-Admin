import axios from 'axios';
import { getAppToken } from '../services/Cookie';

const http = axios.create({
  baseURL: "https://chatbothcmustesting.onrender.com",
  timeout: 5000,
});


http.interceptors.request.use(config => {
  if (!config.url.includes('/admin/auth')) {
    config.headers['X-Auth-Token'] = getAppToken();
  }
  return config;
}, error => {
  return Promise.reject(error);
});



export default http;
