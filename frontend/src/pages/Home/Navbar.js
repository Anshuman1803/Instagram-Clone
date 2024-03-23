import React from 'react'
import { NavLink } from 'react-router-dom'
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


export default function Navbar() {
    return (
        <>
            <div className='navbar'>
                <img className='instaLogo' src={Logo} alt='insta logo' />
                <img className='instaLogo __instaIcon_Hide' src={instaIcon} alt='insta logo' />
                <nav>
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
                    <NavLink className='navLink' to='/profile' >
                        <img className='navIcon' src={Profile} alt='' />   <span className='__navTitle'>Profile</span>
                    </NavLink>
                </nav>
                <button className='__navbar_moreButton'>
                    <NavLink className='navLink'>
                        <img className='moreIcon' src={Bars} alt='' />    <span className='__navTitle'>More</span>
                    </NavLink>
                </button>
            </div>
        </>
    )
}

