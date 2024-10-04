import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../screen/Login';
import DashboardLayout from '../screen/DashboardLayout';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
