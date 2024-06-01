import axios from 'axios';
const token = localStorage.getItem("instaTOKEN")
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
axios.defaults.baseURL = 'http://localhost:5000/api/v1/';

export default axios;