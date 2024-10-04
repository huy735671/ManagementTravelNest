import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header'; // Import Header
import Menu from '../components/Menu'; // Import Menu
import Dashboard from '../components/Management/Dashboard'; // Import Dashboard
import UserManagement from '../components/Management/UserManagement'; // Import UserManagement
import HotelManagement from '../components/Management/HotelManagement'; // Import HotelManagement
import PlacesPage from '../components/Management/PlacesPage'; // Import HotelManagement
import '../CSS/Dashboard/DashboardLayout.css'; // Import CSS
import DiscountPage from '../components/Management/DiscountPage';

const DashboardLayout = () => {
  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <Menu />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="places-page" element={<PlacesPage />}/>
            <Route path='discount-page' element={<DiscountPage/>}/>
            <Route path="user-management" element={<UserManagement />} />
            <Route path="hotel-management" element={<HotelManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
