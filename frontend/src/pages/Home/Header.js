import React from 'react'
// import { NavLink } from 'react-router-dom'
import Logo from '../../Assets/Logo.png'
// import Search from '../../Assets/search.svg'
// import Notification from '../../Assets/heart.png'
// import create from '../../Assets/create.png'

export default function Header() {
    return (
        <header className='__nav_Header'>
            <img className='__nav_Logo' src={Logo} alt='insta logo' />
            {/* <img className='__create_Logo' src={create} alt='create logo' /> */}

            {/* <div className="__nav_Header_Right">
                <div className="search">
                    <img src={Search} alt='' />
                    <input className='__nav_search' type="text" placeholder='search' />
                </div>
                <NavLink className='' to='/notification'>
                    <img className='' src={Notification} alt='' />
                </NavLink>
            </div> */}
        </header>
    )
}
