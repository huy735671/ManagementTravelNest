import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import '../../../CSS/Component/Management/User/EditUserModal.css';

const EditUserModal = ({ userId, onClose, onSave }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      setUser(userDoc.data());
      setUsername(userDoc.data().username);
      setEmail(userDoc.data().email);
      setPhone(userDoc.data().phone);
      setAddress(userDoc.data().address);
      setRole(userDoc.data().role);
    };

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { username, email, phone, address, role });
    onSave(); // Refresh the user list
  };

  return (
    <div className="edit-user-modal">
      <div className="modal-content">
        <h2>Chỉnh sửa người dùng</h2>
        {user && (
          <form className="form">
            <div className="form-group">
              <label>Tên người dùng:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên người dùng"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div className="form-group">
              <label>Vai trò:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-save" onClick={handleSave}>Lưu</button>
              <button type="button" className="btn-close" onClick={onClose}>Đóng</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUserModal;
