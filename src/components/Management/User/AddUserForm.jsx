import React, { useState } from 'react';
import { auth, db } from '../../../firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import '../../../CSS/Component/Management/User/AddUserForm.css';

const AddUserForm = ({ fetchUsers, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', email);
      await setDoc(userDocRef, {
        username,
        email,
        phone,
        address,
        role,
        uid: user.uid,
      });

      setSuccess('Người dùng đã được thêm thành công!');
      setUsername('');
      setEmail('');
      setPassword('');
      setPhone('');
      setAddress('');
      setRole('user');
      fetchUsers();
      onClose(); // Đóng modal sau khi thêm người dùng thành công
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error);
      setError(`Đã xảy ra lỗi khi thêm người dùng: ${error.message}`);
    }
  };

  return (
    <div className="user-form">
      <button className="close-button" onClick={onClose}>×</button>
      <h2>Thêm người dùng mới</h2>
      <form onSubmit={handleAddUser}>
        <div className="form-group">
          <div>
            <label>Tên người dùng:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên người dùng"
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div>
            <label>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <div>
            <label>Số điện thoại:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div>
            <label>Địa chỉ:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ"
              required
            />
          </div>
          <div>
            <label>Vai trò:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
        </div>
        <button type="submit">Thêm người dùng</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default AddUserForm;
