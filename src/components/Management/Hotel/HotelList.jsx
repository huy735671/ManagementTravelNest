// HotelList.jsx
import React, { useState } from 'react';
import '../../../CSS/Component/Management/Hotel/HotelList.css'; // Import CSS riêng cho HotelList
import EditHotelModal from './EditHotelModal';

const HotelList = ({ hotels, onHotelUpdate }) => {
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
  
    const handleHotelClick = (hotel) => {
      setSelectedHotel(hotel);
      setIsEditing(true);
    };
  
    const handleCloseModal = () => {
      setIsEditing(false);
      setSelectedHotel(null);
    };
  
    const handleUpdateHotel = async (updatedHotel) => {
      await onHotelUpdate(updatedHotel);
      handleCloseModal(); // Close modal after update
    };
  
    return (
      <div className="hotel-list">
        <ul>
          {hotels.map((hotel) => (
            <li key={hotel.id} onClick={() => handleHotelClick(hotel)}>
              <img
                src={hotel.imageUrl}
                alt={hotel.hotelName}
                className="hotel-thumbnail"
              />
              <span>{hotel.hotelName}</span>
            </li>
          ))}
        </ul>
  
        {isEditing && selectedHotel && (
          <EditHotelModal
            hotel={selectedHotel}
            onClose={handleCloseModal}
            onUpdate={handleUpdateHotel}
          />
        )}
      </div>
    );
  };
  
  export default HotelList;