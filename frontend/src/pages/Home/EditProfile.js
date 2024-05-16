import React from 'react'
import pf from '../../Assets/profile.png'

export default function EditProfile() {
  return (
    <div className='__editProfilePage'>
      <h2 className='__pageHeader'>Edit Profile</h2>
      <form className='__editForm'>
        <div className="__profile">
          <aside className='__left_section' style={{ display: 'flex' }}>
            <img style={{ width: '60px' }} src={pf} alt="" />
            <section>
              <h3>rishii</h3>
              <p style={{ fontSize: '14px' }}>Saptarsi Mitra</p>
            </section>
          </aside>
          <button className='__profileImage_Btn' type='button'>Change photo</button>
        </div>
        <div className='__inputBox'>
          <label htmlFor="fullName">Full Name</label>
          <input className="__inputs" id='fullName' type="text" placeholder='enter full name' />
        </div>
        <div className='__inputBox'>
          <label htmlFor="userName">UserName</label>
          <input className="__inputs" id='userName' type="text" placeholder='enter username' />
        </div>
        <div className='__inputBox'>
          <label htmlFor="email">Email</label>
          <input className="__inputs" id='email' type="text" placeholder='enter e-mail' />
        </div>
        <div className='__inputBox'>
          <label htmlFor="password">Password</label>
          <input className="__inputs" id='password' type="number" placeholder='enter password' />
        </div>
        <div className='__inputBox'>
          <label htmlFor="bio">Bio</label>
          <textarea name="bio" id="bio" rows={5} placeholder='your bio awaits here....' />
        </div>
        <div className='__inputBox'>
          <label htmlFor="gender">Gender</label>
          <select className="__inputs" name="Gender" id="gender">
            <option value="" disabled>select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="none">Prefer not to say</option>
          </select>
          <p style={{ fontSize: '10px' }}>This won't be a part of your public profile.</p>
        </div>



      </form>
    </div>
  )
}
