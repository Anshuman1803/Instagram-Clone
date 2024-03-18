import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function HomeContainer() {
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
