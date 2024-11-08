import React from 'react';
import { Link } from 'react-router-dom'; 
import '../CSS/Dashboard/Menu.css'; 

const Menu = () => {
  return (
    <div className="menu">
      <ul>
        <li><Link to="/dashboard">Trang chủ</Link></li>
        <li><Link to="/dashboard/places-page"> Địa điểm</Link></li>
        <li><Link to={"/dashboard/discount-page"}>Mã giảm giá</Link></li>
        <li><Link to="/dashboard/user-management">Quản lý người dùng</Link></li>
        <li><Link to="/dashboard/hotel-management">Quản lý khách sạn</Link></li>
        <li><Link to="/dashboard/tour-management">Quản lý tour</Link></li>
      </ul>
    </div>
  );
};

export default Menu;
