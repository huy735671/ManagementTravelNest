import React, { useState, useEffect } from "react";
import "../../CSS/Component/Management/DiscountPage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Timestamp } from "firebase/firestore"; // Import Timestamp

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newExpirationDate, setNewExpirationDate] = useState(null);
  const [minAmount, setMinAmount] = useState("");
  const [maxUsage, setMaxUsage] = useState("");
  const [selectedHotel, setSelectedHotel] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editDiscountId, setEditDiscountId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "discounts"));
        const discountsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            expirationDate:
              data.expirationDate instanceof Timestamp
                ? data.expirationDate.toDate() // Kiểm tra nếu là Timestamp
                : null,
          };
        });
        setDiscounts(discountsList);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    const fetchHotels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hotels"));
        const hotelsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotels(hotelsList);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchDiscounts();
    fetchHotels();
  }, []);

  const handleAddDiscount = async () => {
    try {
      const newDiscountCode = {
        code: newCode,
        discount: newDiscount,
        expirationDate: newExpirationDate
          ? Timestamp.fromDate(newExpirationDate)
          : null, // Lưu dưới dạng timestamp
        minAmount: minAmount,
        maxUsage: maxUsage,
        hotelId: selectedHotel,
      };

      await addDoc(collection(db, "discounts"), newDiscountCode);
      setDiscounts([
        ...discounts,
        { id: discounts.length + 1, ...newDiscountCode },
      ]);
      resetForm();
      setShowPopup(false);
    } catch (error) {
      console.error("Error adding discount:", error);
    }
  };

  const handleEditDiscount = async () => {
    try {
      const updatedDiscount = {
        code: newCode,
        discount: newDiscount,
        expirationDate: newExpirationDate
          ? Timestamp.fromDate(newExpirationDate)
          : null, // Lưu dưới dạng timestamp
        minAmount: minAmount,
        maxUsage: maxUsage,
        hotelId: selectedHotel,
      };

      const discountDocRef = doc(db, "discounts", editDiscountId);
      await updateDoc(discountDocRef, updatedDiscount);

      const updatedDiscounts = discounts.map((discount) =>
        discount.id === editDiscountId
          ? { ...discount, ...updatedDiscount }
          : discount
      );
      setDiscounts(updatedDiscounts);
      resetForm();
      setShowPopup(false);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating discount:", error);
    }
  };

  const handleDeleteDiscount = async (id) => {
    try {
      await deleteDoc(doc(db, "discounts", id));
      setDiscounts(discounts.filter((discount) => discount.id !== id));
    } catch (error) {
      console.error("Error deleting discount:", error);
    }
  };

  const handleEditButtonClick = (discount) => {
    setEditDiscountId(discount.id);
    setNewCode(discount.code);
    setNewDiscount(discount.discount);
    setNewExpirationDate(new Date(discount.expirationDate)); // Chuyển đổi sang Date
    setMinAmount(discount.minAmount);
    setMaxUsage(discount.maxUsage);
    setSelectedHotel(discount.hotelId);
    setEditMode(true);
    setShowPopup(true);
  };

  const resetForm = () => {
    setNewCode("");
    setNewDiscount("");
    setNewExpirationDate(null);
    setMinAmount("");
    setMaxUsage("");
    setSelectedHotel("");
  };

  const formatCurrency = (value) => {
    if (typeof value === 'string') {
      const numberValue = Number(value.replace(/\./g, "").replace(/,/g, "."));
      if (!isNaN(numberValue)) {
        return numberValue.toLocaleString("vi-VN", { maximumFractionDigits: 0 });
      }
    }
    return ""; // Trả về chuỗi rỗng nếu value không phải là chuỗi
  };
  

  const handleMinAmountChange = (e) => {
    const inputValue = e.target.value.replace(/\./g, "");
    setMinAmount(inputValue);
    const formattedValue = formatCurrency(inputValue);
    e.target.value = formattedValue;
  };

  return (
    <div className="discount-page">
      <h1>Quản Lý Mã Giảm Giá</h1>
      <div className="add-discount-button-container">
        <button
          onClick={() => {
            resetForm();
            setEditMode(false);
            setShowPopup(true);
          }}
        >
          Thêm Mã Giảm Giá
        </button>
      </div>
      <table className="discount-table">
        <thead>
          <tr>
            <th>Khách sạn</th>
            <th>Mã áp dụng</th>
            <th>Hiệu Lực Đến</th>
            <th>Giá áp dụng</th>
            <th>% giảm giá</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => {
            const hotel = hotels.find((h) => h.id === discount.hotelId);
            return (
              <tr key={discount.id}>
                <td>{hotel ? hotel.title : "Khách sạn không tìm thấy"}</td>
                <td>{discount.code}</td>
                <td>
                  {discount.expirationDate
                    ? new Date(discount.expirationDate).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )
                    : "Không xác định"}
                </td>
                <td>{formatCurrency(discount.minAmount)}</td>
                <td>{discount.maxUsage}%</td>
                <td>
                  <button onClick={() => handleEditButtonClick(discount)}>
                    Sửa
                  </button>
                  <button onClick={() => handleDeleteDiscount(discount.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setShowPopup(false)}>
              &times;
            </span>
            <h2>
              {editMode ? "Cập Nhật Mã Giảm Giá" : "Thêm Mã Giảm Giá Mới"}
            </h2>
            <div className="add-discount-form">
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Mã giảm giá"
              />
              <input
                type="text"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                placeholder="Giá trị giảm %"
              />
              <DatePicker
                id="expiration-date"
                selected={newExpirationDate}
                onChange={(date) => setNewExpirationDate(date)}
                placeholderText="Chọn ngày hết hạn"
                dateFormat="dd/MM/yyyy"
                className="date-picker"
                popperPlacement="bottom"
                showPopperArrow={false}
              />
              <input
                type="text"
                value={minAmount}
                onChange={handleMinAmountChange}
                placeholder="Giá trị tối thiểu"
              />
              <input
                type="text"
                value={maxUsage}
                onChange={(e) => setMaxUsage(e.target.value)}
                placeholder="Số lần sử dụng tối đa"
              />
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
              >
                <option value="">Chọn khách sạn</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.title}
                  </option>
                ))}
              </select>
              <button
                onClick={editMode ? handleEditDiscount : handleAddDiscount}
              >
                {editMode ? "Cập Nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountPage;
