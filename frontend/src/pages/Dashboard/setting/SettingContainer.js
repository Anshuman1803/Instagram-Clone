import React, { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import settingStyle from "./setting.module.css"
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
    <section className={`${settingStyle.__settingSection__mainContainer}`}>
      <div className={`${settingStyle.__settingSection__settingBOX}`}>

        <nav className={`${settingStyle.__settingSection__nav}`}>
          <NavLink to={"/Accout/setting/edit-profile"} className={({ isActive }) => isActive ? settingStyle.active : settingStyle.__settingSection__navItems}>Edit Profile</NavLink>
          <NavLink to={"/Accout/setting/update-password"} className={({ isActive }) => isActive ? settingStyle.active : settingStyle.__settingSection__navItems}>Update Password</NavLink>
          <NavLink to={"/Accout/setting/who_can_see_your_content"} className={({ isActive }) => isActive ? settingStyle.active : settingStyle.__settingSection__navItems}>Privacy</NavLink>
        </nav>

        <div className={`${settingStyle.__settingSection__outletContainer}`}>
          <Outlet />
        </div>

      </div>
    </section>
  )
}

export default SettingContainer