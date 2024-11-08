import React, { useEffect, useState } from "react";
import { FaDollarSign, FaHotel, FaUsers, FaFileAlt } from "react-icons/fa"; // Import icons
import { auth } from "../../../firebaseConfig"; // Firebase authentication import
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore imports
import { db } from "../../../firebaseConfig"; // Firestore config
import { Line } from "react-chartjs-2"; // Import Line chart
import "../../../CSS/Component/Partner/Dashboard.css";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  LineController,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

const DashboardPartner = () => {
  const [hotelName, setHotelName] = useState("");
  const [hotelId, setHotelId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0); // State to store total bookings
  const [totalRevenue, setTotalRevenue] = useState(0); // State to store total revenue
  const [bookingData, setBookingData] = useState([]); // State to store booking data for chart

  ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    LineController,
    Filler,
    Tooltip,
    Legend
  );

  // Fetch hotel name and ID based on logged-in partner's email
  const fetchHotelName = async (email) => {
    try {
      const q = query(collection(db, "hotels"), where("partner", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const hotelData = querySnapshot.docs[0].data();
        setHotelName(hotelData.title);
        setHotelId(querySnapshot.docs[0].id);
      } else {
        setError("Không tìm thấy khách sạn nào liên kết với tài khoản này.");
      }
    } catch (err) {
      console.error("Error fetching hotel:", err);
      setError("Lỗi khi tải thông tin khách sạn.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch booking data
  const fetchBookingsData = async (hotelId) => {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("hotelId", "==", hotelId)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);

      let totalBookingsCount = 0;
      let revenue = 0;
      const pending = [];
      const bookingStats = {};

      bookingsSnapshot.forEach((doc) => {
        const data = doc.data();
        totalBookingsCount += 1;

        // Tính doanh thu nếu trạng thái là "completed"
        if (data.status === "completed") {
          revenue += data.totalPrice;
        } else if (data.status === "pending") {
          pending.push({
            id: doc.id,
            customerName: data.bookedBy.email,
            roomNumber: data.roomNumber,
            checkInDate: new Date(data.checkInDate).toLocaleDateString("vi-VN", {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            status: "Chờ xác nhận",
          });
        }

        // Tính tỷ lệ đặt phòng theo ngày nhận phòng (ngày/tháng/năm)
        const checkInDate = new Date(data.checkInDate);
        const formattedDate = checkInDate.toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
        bookingStats[formattedDate] = (bookingStats[formattedDate] || 0) + 1;
      });

      // Chuyển đổi bookingStats thành mảng để hiển thị trên biểu đồ
      const labels = Object.keys(bookingStats);
      const dataPoints = Object.values(bookingStats);

      setTotalBookings(totalBookingsCount);
      setTotalRevenue(revenue);
      setPendingBookings(pending);
      setBookingData({ labels, dataPoints });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Lỗi khi tải thông tin đặt phòng.");
    }
  };

  // Get the logged-in user's email
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      fetchHotelName(email);
    }
  }, []);

  // Fetch booking data when hotelId is set
  useEffect(() => {
    if (hotelId) {
      fetchBookingsData(hotelId);
    }
  }, [hotelId]);

  const chartData = {
    labels: bookingData.labels,
    datasets: [
      {
        label: "Tỷ lệ đặt phòng",
        data: bookingData.dataPoints,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div className="partner-dashboard">
      <div className="dashboard-container">
        {loading ? (
          <h1>Đang tải...</h1>
        ) : error ? (
          <h1>{error}</h1>
        ) : (
          <h1>Khách sạn {hotelName}</h1>
        )}

        <div className="stats-container">
          <div className="stat-item">
            <h2>Tổng số đặt phòng</h2>
            <p>{totalBookings}</p>
          </div>
          <div className="stat-item">
            <h2>Doanh thu</h2>
            <p>{totalRevenue.toLocaleString("vi-VN")} VND</p>
          </div>
        </div>

        {/* Danh sách các phòng đang chờ xác nhận */}
        <div className="pending-bookings">
          <h2>Đặt phòng gần đây</h2>
          {pendingBookings.length > 0 ? (
            <table className="booking-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>Phòng</th>
                  <th>Ngày nhận phòng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.customerName}</td>
                    <td>{booking.roomNumber}</td>
                    <td>{booking.checkInDate}</td>
                    <td>{booking.status}</td>{" "}
                    
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Không có phòng nào đang chờ xác nhận.</p>
          )}
        </div>

        {/* Biểu đồ tỷ lệ đặt phòng */}
        <div className="booking-chart">
          <h2>Tỷ lệ đặt phòng theo ngày</h2>
          <Line data={chartData} />
        </div>

        {/* Các card quản lý khác */}
        <div className="dashboard-cards">
          <div className="card">
            <FaUsers className="card-icon" />
            <h3>Quản lý Người dùng</h3>
            <p>Xem, thêm, và quản lý thông tin người dùng.</p>
            <button onClick={() => alert("Đi đến quản lý người dùng")}>
              Quản lý Người dùng
            </button>
          </div>
          <div className="card">
            <FaHotel className="card-icon" />
            <h3>Quản lý Khách sạn</h3>
            <p>Xem, thêm, và quản lý thông tin khách sạn.</p>
            <button onClick={() => alert("Đi đến quản lý khách sạn")}>
              Quản lý Khách sạn
            </button>
          </div>
          <div className="card">
            <FaFileAlt className="card-icon" />
            <h3>Báo cáo</h3>
            <p>Xem các báo cáo hệ thống.</p>
            <button onClick={() => alert("Đi đến báo cáo")}>Báo cáo</button>
          </div>
          <div className="card">
            <FaDollarSign className="card-icon" />
            <h3>Doanh thu</h3>
            <p>Xem và quản lý thông tin doanh thu.</p>
            <button onClick={() => alert("Đi đến doanh thu")}>Doanh thu</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPartner;
