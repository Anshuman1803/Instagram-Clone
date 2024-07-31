import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from './Header'
import homeStyle from "./home.module.css"
import { ProblemReport } from './ProblemReport';
import { io } from "socket.io-client"
import { useSelector } from 'react-redux';
const SECONDARY_BACKEND_URL = process.env.REACT_APP_SECONDARY_BACKEND_URL;
export default function HomeContainer() {
  const { instaUserID} = useSelector((state) => state.Instagram);
  const { pathname } = useLocation();
  const navigateTO = useNavigate();
  const [ToggleReport, setShowHideReport] = useState(false)
  useEffect(() => {
    if (pathname === "/") {
      navigateTO("/home");
    }
  }, [pathname, navigateTO]);

  useEffect(() => {
    const socket = io(`${SECONDARY_BACKEND_URL}`,{
        query : {instaUserID}
      });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    return (
        <div className={`${homeStyle.homeContainer}`}>
            <Header CbShowReport= {setShowHideReport}/>
            <Navbar CbShowReport= {setShowHideReport}/>
            {
                ToggleReport && <ProblemReport CbHideReport={setShowHideReport} />
            }
            <div className={`${homeStyle.__outlet}`}>
                <Outlet />
            </div>
        </div>
    )
}
