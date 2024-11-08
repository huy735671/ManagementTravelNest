// src/components/Management/Partner/HotelManagement/RoomFilter.jsx

import React, { useState } from 'react';

const RoomFilter = ({ onSearch, onFilter, onAddRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roomType, setRoomType] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // Gọi hàm tìm kiếm khi người dùng nhập
  };

  const handleFilterChange = (e) => {
    setRoomType(e.target.value);
    onFilter(e.target.value); // Gọi hàm lọc khi người dùng chọn loại phòng
  };

  return (
    <div className="room-filter">
      <input
        type="text"
        placeholder="Tìm kiếm phòng..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <select value={roomType} onChange={handleFilterChange}>
        <option value="">Tất cả loại phòng</option>
        <option value="single">Phòng Đơn</option>
        <option value="double">Phòng Đôi</option>
        <option value="suite">Phòng Suite</option>
      </select>
      <button onClick={onAddRoom}>+ Thêm Phòng</button>
    </div>
  );
};

export default RoomFilter;
