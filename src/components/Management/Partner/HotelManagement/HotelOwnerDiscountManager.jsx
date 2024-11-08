import React, { useEffect, useState, useCallback } from "react";
import { FaTrash } from "react-icons/fa";
import { auth, db } from "../../../../firebaseConfig";
import {
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
  addDoc,
  Timestamp,
} from "firebase/firestore";

const HotelOwnerDiscountManager = () => {
  const [discounts, setDiscounts] = useState([]);
  const [hotelName, setHotelName] = useState("");
  const [hotelId, setHotelId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    value: "",
    maxUsage: "",
    expirationDate: "",
    selectedRooms: [],
  });
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Ngày hết hạn không hợp lệ";
    const date = new Date(timestamp.seconds * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchHotelData = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const userEmail = user.email;

        const hotelQuery = query(
          collection(db, "hotels"),
          where("partner", "==", userEmail)
        );
        const hotelSnapshot = await getDocs(hotelQuery);

        if (!hotelSnapshot.empty) {
          const hotelData = hotelSnapshot.docs[0].data();
          setHotelName(hotelData.title);
          setHotelId(hotelSnapshot.docs[0].id);
        } else {
          setError("Không tìm thấy khách sạn nào liên kết với tài khoản này.");
        }
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      setError("Có lỗi khi tải dữ liệu khách sạn.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDiscountsAndRooms = useCallback(async () => {
    if (!hotelId) return;

    try {
      const discountsQuery = query(
        collection(db, "discounts"),
        where("hotelId", "==", hotelId)
      );
      const discountsSnapshot = await getDocs(discountsQuery);
      const discountsList = discountsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDiscounts(discountsList);

      const roomsQuery = query(
        collection(db, "rooms"),
        where("hotelId", "==", hotelId)
      );
      const roomsSnapshot = await getDocs(roomsQuery);
      const roomsList = roomsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsList);
    } catch (error) {
      console.error("Error fetching discounts/rooms:", error);
      setError("Có lỗi khi tải dữ liệu mã giảm giá hoặc phòng.");
    }
  }, [hotelId]);

  useEffect(() => {
    fetchHotelData();
  }, [fetchHotelData]);

  useEffect(() => {
    fetchDiscountsAndRooms();
  }, [fetchDiscountsAndRooms]);

  const addDiscount = async () => {
    const { code, value, maxUsage, expirationDate, selectedRooms } = newDiscount;

    if (
      code &&
      value &&
      maxUsage &&
      selectedRooms.length > 0 &&
      expirationDate
    ) {
      const discountData = {
        code,
        discount: Number(value),
        maxUsage: Number(maxUsage),
        rooms: selectedRooms,
        hotelId,
        expirationDate: Timestamp.fromDate(new Date(expirationDate)),
      };

      try {
        const docRef = await addDoc(collection(db, "discounts"), discountData);
        setDiscounts((prevDiscounts) => [
          ...prevDiscounts,
          { id: docRef.id, ...discountData },
        ]);
        setNewDiscount({
          code: "",
          value: "",
          maxUsage: "",
          expirationDate: "",
          selectedRooms: [],
        });
        setShowModal(false);
      } catch (error) {
        console.error("Error adding discount:", error);
        alert("Có lỗi xảy ra khi thêm mã giảm giá.");
      }
    } else {
      alert("Vui lòng nhập đầy đủ thông tin và chọn ít nhất một phòng!");
    }
  };

  const deleteDiscount = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
      try {
        await deleteDoc(doc(db, "discounts", id));
        setDiscounts((prevDiscounts) =>
          prevDiscounts.filter((discount) => discount.id !== id)
        );
        alert("Mã giảm giá đã được xóa thành công");
      } catch (error) {
        console.error("Error deleting discount:", error);
        alert("Có lỗi xảy ra khi xóa mã giảm giá");
      }
    }
  };

  const toggleRoomSelection = (roomId) => {
    setNewDiscount((prev) => ({
      ...prev,
      selectedRooms: prev.selectedRooms.includes(roomId)
        ? prev.selectedRooms.filter((id) => id !== roomId)
        : [...prev.selectedRooms, roomId],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiscount((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.container}>
      {loading ? (
        <h1>Đang tải...</h1>
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <h1>Quản lý mã giảm giá của khách sạn: {hotelName}</h1>
      )}

      <button onClick={() => setShowModal(true)} style={styles.addButton}>
        Thêm mã giảm giá
      </button>

      {showModal && (
        <>
          <div style={styles.overlay} onClick={() => setShowModal(false)}></div>
          <div style={styles.modal}>
            <h2>Thêm mã giảm giá</h2>
            <input
              type="text"
              name="code"
              placeholder="Nhập mã giảm giá"
              value={newDiscount.code}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="text"
              name="value"
              placeholder="Nhập % giảm giá"
              value={newDiscount.value}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="date"
              name="expirationDate"
              placeholder="Chọn ngày hết hạn"
              value={newDiscount.expirationDate}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="text"
              name="maxUsage"
              placeholder="Nhập số lượng tối đa"
              value={newDiscount.maxUsage}
              onChange={handleInputChange}
              style={styles.input}
            />
            <div style={styles.roomSelection}>
              <h3>Chọn loại phòng áp dụng:</h3>
              {rooms.map((room) => (
                <label key={room.id} style={styles.roomLabel}>
                  <input
                    type="checkbox"
                    checked={newDiscount.selectedRooms.includes(room.id)}
                    onChange={() => toggleRoomSelection(room.id)}
                  />
                  {`Phòng ${room.roomNumber} - ${room.roomType}`}
                </label>
              ))}
            </div>
            <div style={styles.modalActions}>
              <button onClick={addDiscount} style={styles.submitButton}>
                Thêm mã giảm giá
              </button>
              <button onClick={() => setShowModal(false)} style={styles.closeButton}>
                Đóng
              </button>
            </div>
          </div>
        </>
      )}

      <div style={styles.discountList}>
        <h2>Danh sách mã giảm giá</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Khách sạn</th>
              <th>Mã giảm giá</th>
              <th>Giá trị giảm</th>
              <th>Số lượng mã</th>
              <th>Ngày hết hạn</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id}>
                <td>{hotelName}</td>
                <td>{discount.code}</td>
                <td>{`${discount.discount}%`}</td>
                <td>{discount.maxUsage}</td>
                <td>{formatDate(discount.expirationDate)}</td>
                <td>
                  <button onClick={() => deleteDiscount(discount.id)} style={styles.deleteButton}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    zIndex: 1001,
    width: "400px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  roomSelection: {
    marginBottom: "10px",
  },
  roomLabel: {
    display: "block",
    marginBottom: "5px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
  },
  submitButton: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  closeButton: {
    padding: "10px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  discountList: {
    marginTop: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f8f9fa",
  },
  deleteButton: {
    background: "none",
    border: "none",
    color: "red",
    cursor: "pointer",
  },
};

export default HotelOwnerDiscountManager;
