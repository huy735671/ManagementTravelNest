import React, { useState, useEffect } from 'react';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import '../../CSS/Component/Management/HotelManagement.css';
import AddHotel from '../Management/Hotel/AddHotel';
import HotelList from '../Management/Hotel/HotelList'; // Import component HotelList

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isAddingHotel, setIsAddingHotel] = useState(false); // Trạng thái để xác định có hiển thị form thêm khách sạn hay không

  useEffect(() => {
    const fetchHotels = async () => {
      const hotelsSnapshot = await getDocs(collection(db, 'hotels'));
      const hotelsList = hotelsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHotels(hotelsList);
    };

    fetchHotels();
  }, []);

  const handleHotelUpdate = async (updatedHotel) => {
    const hotelDoc = doc(db, 'hotels', updatedHotel.id);
    await updateDoc(hotelDoc, {
      title: updatedHotel.title,
      imageUrl: updatedHotel.imageUrl,
    });
    // Refresh list after update
    const hotelsSnapshot = await getDocs(collection(db, 'hotels'));
    const hotelsList = hotelsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setHotels(hotelsList);
  };

  const handleAddHotelClick = () => {
    setIsAddingHotel(true);
    setSelectedHotel(null);
    setShowModal(true);
  };

  const handleShowHotelList = () => {
    setIsAddingHotel(false);
    setShowModal(false);
  };

  return (
    <div className="hotel-management">
      <h1>Quản lý Khách sạn</h1>
      <div className="add-list">
        <button className="toggle-list-btn" onClick={handleShowHotelList}>
          Danh sách khách sạn
        </button>
        <button className="add-hotel-btn" onClick={handleAddHotelClick}>
          Thêm Khách Sạn
        </button>
      </div>

      {isAddingHotel ? (
        <AddHotel
          isVisible={showModal}
          onClose={() => {
            setShowModal(false);
            setIsAddingHotel(false);
          }}
          hotelToEdit={selectedHotel}
        />
      ) : (
        <HotelList hotels={hotels} onHotelUpdate={handleHotelUpdate} />
      )}
    </div>
  );
};

export default HotelManagement;
