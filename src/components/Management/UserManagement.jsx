import React, { useState, useEffect } from "react";
import UserList from "../Management/User/UserList";
import AddUserForm from "../Management/User/AddUserForm";
import "../../CSS/Component/Management/UserManagement.css";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Modal from "react-modal";

const UserManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]); // State for partners
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const qAdmin = query(
        collection(db, "users"),
        where("role", "==", "admin")
      );
      const qUser = query(collection(db, "users"), where("role", "==", "user"));
      const qPartner = query(collection(db, "users"), where("role", "==", "partner")); // Fetch partners

      const querySnapshotAdmin = await getDocs(qAdmin);
      const querySnapshotUser = await getDocs(qUser);
      const querySnapshotPartner = await getDocs(qPartner); // Get partners

      const adminList = querySnapshotAdmin.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const userList = querySnapshotUser.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const partnerList = querySnapshotPartner.docs.map((doc) => ({ // Map partners
        id: doc.id,
        ...doc.data(),
      }));

      setAdmins(adminList);
      setUsers(userList);
      setPartners(partnerList); // Update partners state
    } catch (error) {
      console.error("Lỗi khi lấy người dùng:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (userId) => {
    // Implement logic to handle user editing
    console.log("Edit user with ID:", userId);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  };

  return (
    <div className="user-management">
      <h1>Quản lý Người dùng</h1>
      <div className="user-info">
        <p>
          Trang này cho phép bạn xem, thêm, và quản lý thông tin người dùng.
        </p>
        <button onClick={() => setIsModalOpen(true)} className="btn-add-user">
          Thêm người dùng
        </button>
      </div>
      <div className="user-list-form-container">
        <UserList
          admins={admins}
          users={users}
          partners={partners} // Pass partners to UserList
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Thêm người dùng"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <AddUserForm fetchUsers={fetchUsers} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default UserManagement;
