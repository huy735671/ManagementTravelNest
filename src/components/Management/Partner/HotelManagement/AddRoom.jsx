import React, { useState } from 'react';
import { db } from '../../../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import '../../../../CSS/Component/Partner/HotelManagement/AddRoom.css';

const AddRoom = ({ onClose, hotelId }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('');
  const [status, setStatus] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [capacity, setCapacity] = useState('');
  const [area, setArea] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [view, setView] = useState('');
  const [image, setImage] = useState('');
  const [allowSmoking, setAllowSmoking] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!roomNumber || !roomType || !status || !pricePerNight || !capacity || !area || !view) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    try {
      await addDoc(collection(db, 'rooms'), {
        roomNumber,
        roomType,
        status,
        pricePerNight,
        capacity,
        area,
        amenities,
        view,
        image,
        allowSmoking,
        hotelId,
      });
      resetForm();
      alert('Thêm phòng thành công!');
      onClose();
    } catch (err) {
      console.error('Error adding room:', err);
      setError('Lỗi khi thêm phòng.');
    }
  };

  const resetForm = () => {
    setRoomNumber('');
    setRoomType('');
    setStatus('');
    setPricePerNight('');
    setCapacity('');
    setArea('');
    setView('');
    setImage('');
    setAllowSmoking(false);
    setAmenities([]);
    setError(null);
  };

  const handleAmenityChange = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

 const handleImageChange = (e) => {
    const file = e.target.files[0]; // Lấy tệp hình ảnh được chọn
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Cập nhật trạng thái hình ảnh
      };
      reader.readAsDataURL(file); // Đọc tệp hình ảnh
    }
  };
  return (
    <div className="add-room-container">
      <h1>Thêm Phòng</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="roomNumber">Số phòng:</label>
          <input
            type="text"
            id="roomNumber"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="roomType">Loại phòng:</label>
          <select
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            required
          >
            <option value="">Chọn loại phòng</option>
            <option value="Phòng đơn">Phòng đơn</option>
            <option value="Phòng đôi">Phòng đôi</option>
            <option value="Phòng Suite">Phòng Suite</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="status">Trạng thái:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Chọn trạng thái</option>
            <option value="Sẵn có">Sẵn có</option>
            <option value="Đặt trước">Đặt trước</option>
            <option value="Bảo trì">Bảo trì</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="pricePerNight">Giá mỗi đêm:</label>
          <input
            type="number"
            id="pricePerNight"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Sức chứa:</label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="area">Diện tích phòng (m²):</label>
          <input
            type="number"
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="view">Hướng tầm nhìn:</label>
          <select
            id="view"
            value={view}
            onChange={(e) => setView(e.target.value)}
            required
          >
            <option value="">Chọn hướng tầm nhìn</option>
            <option value="Bạn công">Bạn công</option>
            <option value="Nhìn ra núi">Nhìn ra núi</option>
            <option value="Nhìn ra biển">Nhìn ra biển</option>
            <option value="Thành phố">Thành phố</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image">Hình ảnh phòng:</label>
          <input
            type="file" // Thay đổi kiểu thành file
            id="image"
            accept="image/*" // Chỉ cho phép hình ảnh
            onChange={handleImageChange} // Sử dụng hàm xử lý sự kiện
          /></div>
          <div className=" imgtick-group">
          {image && <img src={image} alt="Hình ảnh phòng" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />} {/* Hiển thị hình ảnh */}
  
        
        <div className=" checkbox-group">
          <label>Cho phép hút thuốc:</label>
          <input
            type="checkbox"
            checked={allowSmoking}
            onChange={() => setAllowSmoking(!allowSmoking)}
          />
        </div></div>
        
        <div className="amenities-section">
          <h2>Tiện nghi phòng:</h2>
          <div className="amenities-grid">
            {[
              'Bàn làm việc',
              'Thiết bị báo carbon monoxide',
              'Két an toàn',
              'TV màn hình phẳng',
              'Ghế sofa',
              'Khăn tắm',
              'Ổ điện gần giường',
              'TV',
              'Tủ lạnh',
              'Ra trải giường',
              'Dịch vụ streaming (như Netflix)',
              'Minibar',
              'Sàn lát gạch/đá cẩm thạch',
              'Ấm đun nước điện',
              'Máy điều hòa độc lập cho từng phòng',
              'Tủ hoặc phòng để quần áo',
              'Điều hòa không khí',
            ].map((amenity) => (
              <div key={amenity} className="amenity-item">
                <label>
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">Lưu</button>
          <button type="button" className="cancel-button" onClick={onClose}>Hủy bỏ</button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
