import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from './Header'
import homeStyle from "./home.module.css"
export default function HomeContainer() {
  const { pathname } = useLocation();
  const navigateTO = useNavigate();
  useEffect(() => {
    if (pathname === "/") {
      navigateTO("/home");
    }
  }, [pathname, navigateTO]);
    return (
        <div className={`${homeStyle.homeContainer}`}>
            {/* <h1>Instagram Dashboard</h1> */}
            <Header />
            <Navbar />
            <div className={`${homeStyle.__outlet}`}>
                <Outlet />
            </div>
        </div>
    )
}
