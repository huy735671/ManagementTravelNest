import React from 'react';
import { FaDollarSign, FaHotel, FaUsers, FaMapMarkedAlt, FaUserTie } from 'react-icons/fa'; // Import icons
import '../../CSS/Component/Management/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>Trang chủ</h1>
        
        {/* Thêm các ô thông tin nhỏ */}
        <div className="dashboard-overview">
          <div className="overview-card">
            <div className="card-content">
              <FaDollarSign className="icon" />
              <div className="info">
                <h3>Doanh thu</h3>
                <p>1.000.000 VND</p>
              </div>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-content">
              <FaUserTie className="icon" />
              <div className="info">
                <h3>Số lượng chủ trọ</h3>
                <p>50</p>
              </div>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-content">
              <FaUsers className="icon" />
              <div className="info">
                <h3>Số lượng thành viên</h3>
                <p>200</p>
              </div>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-content">
              <FaHotel className="icon" />
              <div className="info">
                <h3>Số lượng khách sạn</h3>
                <p>150</p>
              </div>
            </div>
          </div>
          <div className="overview-card">
            <div className="card-content">
              <FaMapMarkedAlt className="icon" />
              <div className="info">
                <h3>Số lượng địa điểm nổi bật</h3>
                <p>30</p>
              </div>
            </div>
          </div>
        </div>

        {/* Các card quản lý khác */}
        <div className="dashboard-cards">
          <div className="card">
            <h3>Quản lý Người dùng</h3>
            <p>Xem, thêm, và quản lý thông tin người dùng.</p>
            <button onClick={() => alert('Đi đến quản lý người dùng')}>Quản lý Người dùng</button>
          </div>
          <div className="card">
            <h3>Quản lý Khách sạn</h3>
            <p>Xem, thêm, và quản lý thông tin khách sạn.</p>
            <button onClick={() => alert('Đi đến quản lý khách sạn')}>Quản lý Khách sạn</button>
          </div>
          <div className="card">
            <h3>Báo cáo</h3>
            <p>Xem các báo cáo hệ thống.</p>
            <button onClick={() => alert('Đi đến báo cáo')}>Báo cáo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
