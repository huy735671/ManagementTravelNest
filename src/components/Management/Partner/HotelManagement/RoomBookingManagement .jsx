import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../../../firebaseConfig";
import "../../../../CSS/Component/Partner/HotelManagement/RoomBookingManagement.css";

const RoomBookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [hotelId, setHotelId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility

  const fetchHotelId = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userEmail = user.email;

        const hotelQuery = query(
          collection(db, "hotels"),
          where("partner", "==", userEmail)
        );
        const hotelSnapshot = await getDocs(hotelQuery);

        if (!hotelSnapshot.empty) {
          setHotelId(hotelSnapshot.docs[0].id);
        } else {
          setError("Không tìm thấy khách sạn nào liên kết với tài khoản này.");
        }
      }
    } catch (error) {
      console.error("Error fetching hotel ID:", error);
      setError("Có lỗi khi tải dữ liệu khách sạn.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    if (!hotelId) return;

    setLoading(true);
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("hotelId", "==", hotelId)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsList = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsList);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Có lỗi khi tải dữ liệu đặt phòng.");
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchHotelId();
  }, [fetchHotelId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings, hotelId]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: newStatus });
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      setError("Có lỗi khi cập nhật trạng thái đặt phòng.");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true; // Trả về tất cả nếu trạng thái là "Tất cả"
    return (
      (booking.bookedBy?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        booking.roomType?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      booking.status === filterStatus // Lọc theo trạng thái
    );
  });

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleFilterStatusChange = (status) => {
    setFilterStatus(status);
    setShowDropdown(false); // Close dropdown after selecting
  };

  return (
    <div className="container">
      <h1>Quản lý đặt phòng</h1>
      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Tìm kiếm theo email khách hoặc loại phòng"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchInput"
      />
      <table className="table">
        <thead>
          <tr>
            <th>Tên khách</th>
            <th>Loại phòng</th>
            <th>Số lượng phòng</th>
            <th>Số người lớn</th>
            <th>Số trẻ em</th>
            <th>Ngày nhận phòng</th>
            <th>Ngày trả phòng</th>
            <th
              onClick={handleDropdownToggle}
              style={{ cursor: "pointer", position: "relative" }}
            >
              Trạng thái {showDropdown ? "▲" : "▼"} {/* Biểu tượng hiển thị */}
              {showDropdown && (
                <div className="dropdown">
                  <div
                    onClick={() => handleFilterStatusChange("all")} // Gọi hàm lọc với trạng thái 'all'
                    className={filterStatus === "all" ? "selected" : ""} // Đánh dấu trạng thái đã chọn
                  >
                    Tất cả
                  </div>
                  {["pending", "confirmed", "completed", "cancelled"].map(
                    (status) => (
                      <div
                        key={status}
                        onClick={() => handleFilterStatusChange(status)}
                        className={filterStatus === status ? "selected" : ""}
                      >
                        {status === "pending" && "Đang chờ"}
                        {status === "confirmed" && "Đã xác nhận"}
                        {status === "completed" && "Hoàn thành"}
                        {status === "cancelled" && "Đã hủy"}
                      </div>
                    )
                  )}
                </div>
              )}
            </th>

            <th>Tổng giá</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.bookedBy?.email}</td>
                <td>{booking.roomType}</td>
                <td>{booking.rooms}</td> {/* Hiển thị số lượng phòng */}
                <td>{booking.adults}</td> {/* Hiển thị số người lớn */}
                <td>{booking.children}</td> {/* Hiển thị số trẻ em */}
                <td>
                  {new Date(booking.checkInDate).toLocaleDateString("en-GB")}
                </td>
                <td>
                  {new Date(booking.checkOutDate).toLocaleDateString("en-GB")}
                </td>
                <td>
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      handleStatusChange(booking.id, e.target.value)
                    }
                  >
                    <option value="pending">Đang chờ</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td>{booking.totalPrice?.toLocaleString()} VND</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="noData">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoomBookingManagement;
