import React, { useState } from 'react';
import styles from "../CSS/Login.module.css";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // Import firebaseConfig
import { doc, getDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Trạng thái để ẩn/hiện mật khẩu
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Đăng nhập vào Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
  
      // Kiểm tra vai trò của người dùng trong Firestore
      const userDocRef = doc(db, 'users', email); // Sử dụng email làm ID
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          navigate("/dashboard"); // Điều hướng đến trang dashboard nếu là admin
        } else {
          alert("Bạn không có quyền truy cập vào trang quản trị!");
        }
      } else {
        alert("Tài khoản không tồn tại!");
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      alert("Sai email hoặc mật khẩu!"); // Thông báo lỗi nếu thông tin đăng nhập không đúng
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email ở đây"
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Mật khẩu:</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"} // Thay đổi loại input dựa trên trạng thái
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu thì chỗ này"
              required
              className={styles.input}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye} // Chọn icon dựa trên trạng thái
              onClick={() => setShowPassword(!showPassword)} // Đổi trạng thái khi nhấn vào icon
              className={styles.passwordIcon}
            />
          </div>
        </div>
        <button type="submit" className={styles.button}>
          Đăng Nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
