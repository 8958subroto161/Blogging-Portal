import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Change to your backend URL
});

export default instance;
