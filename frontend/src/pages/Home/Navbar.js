import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../../Assets/Logo.png'
import instaIcon from '../../Assets/insta_Icon.svg'
import Home from '../../Assets/home.svg'
import Search from '../../Assets/search.svg'
import Explore from '../../Assets/compass.png'
import Messages from '../../Assets/messenger.svg'
import Notification from '../../Assets/heart.png'
import Create from '../../Assets/create.png'
import Profile from '../../Assets/profile.png'
import Bars from '../../Assets/bars.png'
import { useSelector, useDispatch } from "react-redux";
import { UserLoggedOut } from '../../Redux/ReduxSlice';
import toast from 'react-hot-toast';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function Navbar() {
    const navigateTO = useNavigate()
    const dispatch = useDispatch()
    const { instaUserID, instaUserName } = useSelector((state) => state.Instagram);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        dispatch(UserLoggedOut())
        toast.success(`${instaUserName} Logged out !!`)
        setTimeout(() => {
            navigateTO('/user/auth/signin')
        }, 1000);
    }

    return (
        <>
            <div className='navbar'>
                <img className='instaLogo' src={Logo} alt='insta logo' />
                <img className='instaLogo __instaIcon_Hide' src={instaIcon} alt='insta logo' />
                <nav className='primary__navbar'>
                    <NavLink className='navLink' to='/home'>
                        <img className='navIcon' src={Home} alt='' />  <span className='__navTitle'>Home</span>
                    </NavLink>
                    <NavLink className='navLink' to='/search'>
                        <img className='navIcon' src={Search} alt='' />   <span className='__navTitle'>Search</span>
                    </NavLink>
                    <NavLink className='navLink' to='/explore' >
                        <img className='navIcon' src={Explore} alt='' />   <span className='__navTitle'>Explore</span>
                    </NavLink>
                    <NavLink className='navLink' to='/messages' >
                        <img className='navIcon' src={Messages} alt='' />   <span className='__navTitle'>Messages</span>
                    </NavLink>
                    <NavLink className='navLink' to='/notification'>
                        <img className='navIcon' src={Notification} alt='' />   <span className='__navTitle'>Notification</span>
                    </NavLink>
                    <NavLink className='navLink' to='/create'>
                        <img className='navIcon' src={Create} alt='' />   <span className='__navTitle'>Create</span>
                    </NavLink>
                    <NavLink className='navLink' to={`/${instaUserID}`} >
                        <img className='navIcon' src={Profile} alt='' />   <span className='__navTitle'>Profile</span>
                    </NavLink>
                </nav>

                {/* <button className='__navbar_moreButton'>
                    <NavLink className='navLink'>
                        <img className='moreIcon' src={Bars} alt='' />    <span className='__navTitle'>More</span>
                    </NavLink>
                </button> */}

                <div className='__navbar_moreButton'>
                    <NavLink className='navLink'>
                        <img className='moreIcon' src={Bars} alt='' />
                        <span className='__navTitle' style={{ color: 'black' }} id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
                            More
                        </span>
                    </NavLink>
                    <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button', }}>
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>
        </>
    )
}

