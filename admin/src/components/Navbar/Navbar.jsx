import React from 'react';
import "./navbar.css";
import { assets } from "../../assets/assets";

function Navbar() {
  return (
    <>
      <div className="navbar">
        <div className='logo-text'>Délice</div>
        <img className='profile' src={assets.profile_image} alt="profile_pic" />
      </div>
    </>
  );
}

export default Navbar;
