import React from "react";
import { Link } from "react-router-dom";
import "../CSS/Dashboard/Menu.css";

const MenuPartner = () => {
  return (
    <div className="menu">
      <ul>
        <li>
          <Link to="/dashboardPartner">Trang chủ</Link>
        </li>
        <li>
          <Link to="/dashboardPartner/room-management"> Quản lý phòng</Link>
        </li>
        <li>
          <Link to="/dashboardPartner/DiscountOwnerManager"> Quản lý giảm giá</Link>
        </li>
        <li>
          <Link to="/dashboardPartner/RoomBookingManagement" >Quản lý đặt phòng</Link>
        </li>
        <li>
          <Link to="/dashboardPartner/DiscountManager" >Quản lý giảm giá</Link>
        </li>
      </ul>
    </div>
  );
};

export default MenuPartner;
