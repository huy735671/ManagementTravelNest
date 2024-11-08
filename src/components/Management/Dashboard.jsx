import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaDollarSign, FaHome, FaUsers, FaHotel, FaStar } from 'react-icons/fa';
import { db } from '../../firebaseConfig.js';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../../CSS/Component/Management/Dashboard.css';

Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [revenue, setRevenue] = useState(0);
  const [partnerCount, setPartnerCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [hotelCount, setHotelCount] = useState(0);
  const [placeCount, setPlaceCount] = useState(0);
  const [bookingStatusData, setBookingStatusData] = useState({ labels: [], data: [] });
  const [reviewsData, setReviewsData] = useState({ labels: [], data: [] });
  const [reviewHotelsData, setReviewHotelsData] = useState({ labels: [], data: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsRef = collection(db, 'bookings');
        const bookingsSnapshot = await getDocs(bookingsRef);
        let totalRevenue = 0;
        const statusCounts = {
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
        };

        bookingsSnapshot.forEach(doc => {
          const bookingData = doc.data();

          if (bookingData.status === 'completed') {
            totalRevenue += bookingData.totalPrice || 0;
          }

          if (bookingData.status) {
            statusCounts[bookingData.status] = (statusCounts[bookingData.status] || 0) + 1;
          }
        });

        setRevenue(totalRevenue);

        const labels = Object.keys(statusCounts).map(status => {
          switch (status) {
            case 'pending':
              return 'Chờ xác nhận';
            case 'confirmed':
              return 'Đã xác nhận';
            case 'completed':
              return 'Đã hoàn thành';
            case 'cancelled':
              return 'Đã hủy';
            default:
              return status;
          }
        });

        const data = Object.values(statusCounts);
        setBookingStatusData({ labels, data });

        const partnersRef = collection(db, 'users');
        const partnersQuery = query(partnersRef, where('role', '==', 'partner'));
        const partnersSnapshot = await getDocs(partnersQuery);
        setPartnerCount(partnersSnapshot.size);

        const usersQuery = query(partnersRef, where('role', '==', 'user'));
        const usersSnapshot = await getDocs(usersQuery);
        setUserCount(usersSnapshot.size);

        const hotelsRef = collection(db, 'hotels');
        const hotelsSnapshot = await getDocs(hotelsRef);
        setHotelCount(hotelsSnapshot.size);

        const placesRef = collection(db, 'places');
        const placesSnapshot = await getDocs(placesRef);
        setPlaceCount(placesSnapshot.size);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        const reviewsSnapshot = await getDocs(reviewsRef);
        
        const starCounts = Array(5).fill(0); // Mảng lưu trữ số lượng đánh giá cho mỗi sao (1 đến 5)

        reviewsSnapshot.forEach(doc => {
          const reviewData = doc.data();
          const rating = reviewData.rating; // Giả sử rating được lưu dưới dạng số từ 1 đến 5

          if (rating >= 1 && rating <= 5) {
            starCounts[rating - 1] += 1; // Tăng số lượng đánh giá cho số sao tương ứng
          }
        });

        setReviewsData({
          labels: ['1 sao', '2 sao', '3 sao', '4 sao', '5 sao'],
          data: starCounts,
        });
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    };

    const fetchReviewHotels = async () => {
      try {
        const reviewHotelsRef = collection(db, 'reviewHotels');
        const reviewHotelsSnapshot = await getDocs(reviewHotelsRef);
        
        const starCounts = Array(5).fill(0); // Mảng lưu trữ số lượng đánh giá cho mỗi sao (1 đến 5)

        reviewHotelsSnapshot.forEach(doc => {
          const reviewData = doc.data();
          const rating = reviewData.rating; // Giả sử rating được lưu dưới dạng số từ 1 đến 5

          if (rating >= 1 && rating <= 5) {
            starCounts[rating - 1] += 1; // Tăng số lượng đánh giá cho số sao tương ứng
          }
        });

        setReviewHotelsData({
          labels: ['1 sao', '2 sao', '3 sao', '4 sao', '5 sao'],
          data: starCounts,
        });
      } catch (error) {
        console.error("Error fetching review hotels: ", error);
      }
    };

    fetchData();
    fetchReviews(); // Gọi hàm lấy dữ liệu đánh giá
    fetchReviewHotels(); // Gọi hàm lấy dữ liệu đánh giá khách sạn
  }, []);

  const chartData = {
    labels: bookingStatusData.labels,
    datasets: [
      {
        label: 'Tỷ lệ đặt phòng theo trạng thái',
        data: bookingStatusData.data,
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  const reviewsChartData = {
    labels: reviewsData.labels,
    datasets: [
      {
        label: 'Đánh giá theo số sao (Đánh giá chung)',
        data: reviewsData.data,
        backgroundColor: [
          'rgba(255, 205, 86, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  const reviewHotelsChartData = {
    labels: reviewHotelsData.labels,
    datasets: [
      {
        label: 'Đánh giá theo số sao (Đánh giá khách sạn)',
        data: reviewHotelsData.data,
        backgroundColor: [
          'rgba(255, 205, 86, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>Trang chủ</h1>
        <div className="dashboard-overview">
          <div className="overview-card">
            <div className="card-content">
              <FaDollarSign className="icon" />
              <div className="info">
                <h3>Doanh thu</h3>
                <p>{revenue.toLocaleString()} VND</p>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-content">
              <FaHome className="icon" />
              <div className="info">
                <h3>Số lượng chủ trọ</h3>
                <p>{partnerCount}</p>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-content">
              <FaUsers className="icon" />
              <div className="info">
                <h3>Số lượng thành viên</h3>
                <p>{userCount}</p>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-content">
              <FaHotel className="icon" />
              <div className="info">
                <h3>Số lượng khách sạn</h3>
                <p>{hotelCount}</p>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-content">
              <FaStar className="icon" />
              <div className="info">
                <h3>Số lượng địa điểm</h3>
                <p>{placeCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="dashboard-chart">
            <Pie data={chartData} />
          </div>

          <div className="dashboard-chart">
            <Bar data={reviewsChartData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="dashboard-chart">
            <Bar data={reviewHotelsChartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
