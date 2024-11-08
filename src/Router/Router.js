import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../screen/Login';
import DashboardLayout from '../screen/DashboardLayout';
import DasnhboardPartnerLayout from '../screen/DasnhboardPartnerLayout';


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="/dashboardPartner/*" element={<DasnhboardPartnerLayout />} />

      </Routes>
    </Router>
  );
};

export default AppRouter;
