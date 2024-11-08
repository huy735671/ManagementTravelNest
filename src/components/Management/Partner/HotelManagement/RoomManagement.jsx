import React, { useEffect, useState, useCallback } from 'react'; // Thêm useCallback
import { FaEdit, FaTrash } from 'react-icons/fa';
import { auth, db } from '../../../../firebaseConfig';
import { getDocs, collection, query, where, deleteDoc, doc } from 'firebase/firestore';
import RoomFilter from './RoomFilter';
import AddRoom from './AddRoom';
import '../../../../CSS/Component/Partner/HotelManagement/RoomManagement.css';

const HotelList = () => {
  const [rooms, setRooms] = useState([]);
  const [hotelName, setHotelName] = useState('');
  const [hotelId, setHotelId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddRoom, setShowAddRoom] = useState(false);

  const fetchHotelData = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userEmail = user.email;

        // Fetch hotel name and id
        const hotelQuery = query(collection(db, "hotels"), where("partner", "==", userEmail));
        const hotelSnapshot = await getDocs(hotelQuery);

        if (!hotelSnapshot.empty) {
          const hotelData = hotelSnapshot.docs[0].data();
          setHotelName(hotelData.title);
          setHotelId(hotelSnapshot.docs[0].id);
        } else {
          setError("Không tìm thấy khách sạn nào liên kết với tài khoản này.");
        }

        // Fetch room data
        const roomsQuery = query(collection(db, "rooms"), where("hotelId", "==", hotelId));
        const roomsSnapshot = await getDocs(roomsQuery);

        const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(roomsList);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError("Có lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchHotelData();
  }, [fetchHotelData]);

  const handleEdit = (roomId) => {
    alert(`Sửa phòng: ${roomId}`);
  };

  const handleDelete = async (roomId) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa phòng này?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'rooms', roomId));
        setRooms(rooms.filter(room => room.id !== roomId));
        alert('Phòng đã được xóa thành công');
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Có lỗi xảy ra khi xóa phòng');
      }
    }
  };

  const handleSearch = (searchTerm) => {
    const filteredRooms = rooms.filter(room => room.roomNumber.includes(searchTerm));
    setRooms(filteredRooms);
  };

  const handleFilter = (roomType) => {
    const filteredRooms = rooms.filter(room => roomType ? room.roomType === roomType : true);
    setRooms(filteredRooms);
  };

  const handleAddRoom = () => {
    setShowAddRoom(!showAddRoom); // Chuyển đổi trạng thái để hiển thị hoặc ẩn phần thêm phòng
  };

  return (
    <div className="hotel-list">
      {loading ? (
        <h1>Đang tải...</h1>
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <h1>Danh sách Khách sạn: {hotelName}</h1>
      )}

      <RoomFilter onSearch={handleSearch} onFilter={handleFilter} onAddRoom={handleAddRoom} />

      <table className="room-table">
        <thead>
          <tr>
            <th>Số Phòng</th>
            <th>Loại Phòng</th>
            <th>Trạng Thái</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length > 0 ? (
            rooms.map(room => (
              <tr key={room.id}>
                <td>{room.roomNumber}</td>
                <td>{room.roomType}</td>
                <td>{room.status}</td>
                <td>{room.pricePerNight} VND</td>
                <td>
                  <button onClick={() => handleEdit(room.id)} className="edit-button">
                    <FaEdit /> Sửa
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="delete-button">
                    <FaTrash /> Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Chưa có phòng nào</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Hiển thị phần thêm phòng như một popup nhỏ bên dưới danh sách phòng */}
      {showAddRoom && (
        <div className="add-room-popup">
          <AddRoom onClose={handleAddRoom} hotelId={hotelId} />
        </div>
      )}
    </div>
  );
};

export default HotelList;
