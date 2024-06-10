import React, { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
function SettingContainer() {
  const { pathname } = useLocation();
  const navigateTO = useNavigate();

  useEffect(() => {
    if (pathname === "/Accout/setting") {
      navigateTO("/Accout/setting/edit-profile");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  
  return (
    <section className='__settingSection__mainContainer'>
      <div className='__settingSection__settingBOX'>

        <nav className='__settingSection__nav'>
          <NavLink to={"/Accout/setting/edit-profile"} className="__settingSection__navItems">Edit Profile</NavLink>
          <NavLink to={"/Accout/setting/update-password"} className="__settingSection__navItems">Update Password</NavLink>
          <NavLink to={"/Accout/setting/who_can_see_your_content"} className="__settingSection__navItems">Privacy</NavLink>
        </nav>

        <div className='__settingSection__outletContainer'>
          <Outlet />
        </div>

      </div>
    </section>
  )
}

export default SettingContainer