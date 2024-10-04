import React, { useState } from 'react';
import styles from '../../../CSS/Component/Management/Hotel/AddHotel.module.css';

export default function AddRoom() {
  const [roomType, setRoomType] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomPrice, setRoomPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý thêm phòng ở đây
  };
 
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Thêm Phòng Mới</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="roomType" className={styles.label}>Loại Phòng</label>
          <select id="roomType" className={styles.select} value={roomType} onChange={(e) => setRoomType(e.target.value)}>
            <option value="">Chọn loại phòng</option>
            <option value="single">Phòng Đơn</option>
            <option value="double">Phòng Đôi</option>
            <option value="suite">Phòng Suite</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="roomNumber" className={styles.label}>Số Phòng</label>
          <input id="roomNumber" className={styles.input} value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="roomPrice" className={styles.label}>Giá/Đêm</label>
          <input id="roomPrice" type="number" className={styles.input} value={roomPrice} onChange={(e) => setRoomPrice(e.target.value)} />
        </div>
        <div className={styles.actions}>
          <button type="button" className={`${styles.button} ${styles.buttonOutline}`}>Hủy</button>
          <button type="submit" className={styles.button}>Thêm Phòng</button>
        </div>
      </form>
    </div>
  );
}
