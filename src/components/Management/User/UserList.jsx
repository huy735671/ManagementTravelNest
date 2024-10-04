import React, { useState } from 'react';
import EditUserModal from './EditUserModal';
import '../../../CSS/Component/Management/User/UserList.css';

const UserList = ({ admins, users, onEditUser, onDeleteUser }) => {
  const [editingUserId, setEditingUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số lượng người dùng hiển thị mỗi trang

  const handleEditClick = (userId) => {
    setEditingUserId(userId);
  };

  const handleCloseModal = () => {
    setEditingUserId(null);
  };

  const handleSaveChanges = () => {
    onEditUser(); // Refresh the user list or handle other necessary actions
    handleCloseModal();
  };

  // Phân trang cho danh sách người dùng
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = admins.slice(indexOfFirstItem, indexOfLastItem);
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  // Tạo danh sách các số trang
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(users.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="user-list">
      <h2>Danh sách người dùng</h2>
      <h3>Quản trị viên</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentAdmins.map((admin, index) => (
            <tr key={admin.id}>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td>{admin.address}</td>
              <td>{admin.phone}</td>
              <td>{admin.role}</td>
              <td>
                <button onClick={() => handleEditClick(admin.id)}>Sửa</button>
                <button onClick={() => onDeleteUser(admin.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Người dùng</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEditClick(user.id)}>Sửa</button>
                <button onClick={() => onDeleteUser(user.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={currentPage === number ? 'active' : ''}
          >
            {number}
          </button>
        ))}
      </div>
      {editingUserId && (
        <EditUserModal
          userId={editingUserId}
          onClose={handleCloseModal}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default UserList;
