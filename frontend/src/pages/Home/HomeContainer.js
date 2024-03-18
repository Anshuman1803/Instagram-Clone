import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from './Header'

export default function HomeContainer() {
  const { pathname } = useLocation();
  const navigateTO = useNavigate();
  useEffect(() => {
    if (pathname === "/") {
      navigateTO("/home");
    }
  }, [pathname, navigateTO]);
    return (
        <div className='homeContainer'>
            {/* <h1>Instagram Dashboard</h1> */}
            <Header />
            <Navbar />
            <div className="__outlet">
                <Outlet />
            </div>
        </div>
    )
}
