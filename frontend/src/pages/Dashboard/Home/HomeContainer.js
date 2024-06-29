import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from './Header'
import homeStyle from "./home.module.css"
import { ProblemReport } from './ProblemReport';
export default function HomeContainer() {
  const { pathname } = useLocation();
  const navigateTO = useNavigate();
  const [ToggleReport, setShowHideReport] = useState(false)
  useEffect(() => {
    if (pathname === "/") {
      navigateTO("/home");
    }
  }, [pathname, navigateTO]);
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
