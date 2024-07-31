import { io } from 'socket.io-client';
const SECONDARY_BACKEND_URL = process.env.REACT_APP_SECONDARY_BACKEND_URL;
const socket = io(`${SECONDARY_BACKEND_URL}`, {
  query: {
    instaUserID : localStorage.getItem('instaUserID'),
  },
});

export default socket;