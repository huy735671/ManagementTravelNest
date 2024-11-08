import React, { useState } from 'react';
import '../../../CSS/Component/Management/Hotel/HotelList.css'; // Import CSS riêng cho HotelList
import EditHotelModal from './EditHotelModal';

const HotelList = ({ hotels, onHotelUpdate }) => {
    const [selectedHotel, setSelectedHotel] = useState(null);
  
    const handleHotelClick = (hotel) => {
        // Kiểm tra nếu khách sạn đang được chỉnh sửa là khách sạn đã chọn, nếu có thì tắt
        if (selectedHotel && selectedHotel.id === hotel.id) {
            setSelectedHotel(null);
        } else {
            setSelectedHotel(hotel);
        }
    };
  
    const handleCloseModal = () => {
        setSelectedHotel(null);
    };
  
    const handleUpdateHotel = async (updatedHotel) => {
        await onHotelUpdate(updatedHotel);
        handleCloseModal(); // Đóng modal sau khi cập nhật
    };
  
    return (
      <div className="hotel-list">
        <ul>
          {hotels.map((hotel) => (
            <React.Fragment key={hotel.id}>
              <li onClick={() => handleHotelClick(hotel)}>
                <img
                  src={hotel.imageUrl}
                  alt={hotel.title}
                  className="hotel-thumbnail"
                />
                <span>{hotel.title}</span>
              </li>

              {/* Hiển thị modal dưới khách sạn đã chọn */}
              {selectedHotel && selectedHotel.id === hotel.id && (
                <EditHotelModal
                  hotel={selectedHotel}
                  onClose={handleCloseModal}
                  onUpdate={handleUpdateHotel}
                />
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    );
};
  
export default HotelList;
