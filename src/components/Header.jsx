import React, { useState } from 'react';
import '../CSS/Dashboard/Header.css'; 

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.png" alt="Logo" className="logo-image" />
        <h1 className="app-name">TravelNest</h1>
      </div>
      <div className="user-profile">
        <img
          src="/avartar.png"
          alt="User Avatar"
          className="user-avatar"
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <a href="#profile">Thông tin</a>
            <a href="#settings">Cài đặt</a>
            <a href="#logout">Đăng xuất</a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
