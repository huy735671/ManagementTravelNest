import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header'; // Import Header
import MenuPartner from '../components/MenuPartner'; // Import Menu
import DashboardPartner from '../components/Management/Partner/DashboardPartner'; // Import DashboardPartner 
import '../CSS/Dashboard/DashboardLayout.css';
import RoomManagement from '../components/Management/Partner/HotelManagement/RoomManagement';
import HotelOwnerDiscountManager from '../components/Management/Partner/HotelManagement/HotelOwnerDiscountManager';
import RoomBookingManagement from '../components/Management/Partner/HotelManagement/RoomBookingManagement ';
import DiscountManager from '../components/Management/Partner/HotelManagement/DiscountManager';

const DashboardPartnerLayout = () => {
  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <MenuPartner />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPartner />} />
            <Route path="room-management" element={<RoomManagement />} />
            <Route path="DiscountOwnerManager" element={<HotelOwnerDiscountManager/>} />
            <Route path="RoomBookingManagement" element={<RoomBookingManagement/>} />
            <Route path='DiscountManager' element={<DiscountManager/>} />
            {/* <Route path="reports" element={<Reports />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardPartnerLayout; 
