import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedIn } from "./Redux/ReduxSlice";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function LoadData() {
  return (
    <div>LoadData</div>
  )
}

export default LoadData