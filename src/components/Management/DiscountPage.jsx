import React, { useState, useEffect } from "react";
import "../../CSS/Component/Management/DiscountPage.css";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newExpirationDate, setNewExpirationDate] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editDiscountId, setEditDiscountId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "discounts"));
        const discountsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDiscounts(discountsList);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    fetchDiscounts();
  }, []);

  useEffect(() => {
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

    fetchHotels();
  }, []);

  const handleAddDiscount = async () => {
    try {
      const newDiscountCode = {
        code: newCode,
        discount: newDiscount,
        expirationDate: newExpirationDate,
        description: newDescription,
        image: newImage,
        hotels: selectedHotels,
      };

      await addDoc(collection(db, "discounts"), newDiscountCode);
      setDiscounts([
        ...discounts,
        { id: discounts.length + 1, ...newDiscountCode },
      ]);
      resetForm();
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding discount:", error);
    }
  };

  const handleEditDiscount = async () => {
    try {
      const updatedDiscount = {
        code: newCode,
        discount: newDiscount,
        expirationDate: newExpirationDate,
        description: newDescription,
        image: newImage,
        hotels: selectedHotels,
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
      setModalOpen(false);
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
    setNewExpirationDate(discount.expirationDate);
    setNewDescription(discount.description);
    setNewImage(discount.image);
    setSelectedHotels(discount.hotels);
    setEditMode(true);
    setModalOpen(true);
  };

  const resetForm = () => {
    setNewCode("");
    setNewDiscount("");
    setNewExpirationDate("");
    setNewDescription("");
    setNewImage("");
    setSelectedHotels([]);
  };

  return (
    <div className="discount-page">
      <h1>Quản Lý Mã Giảm Giá</h1>

      <button
        onClick={() => {
          resetForm();
          setEditMode(false);
          setModalOpen(true);
        }}
      >
        Thêm Mã Giảm Giá
      </button>

      <div className="discount-list">
        {discounts.map((discount) => (
          <div key={discount.id} className="discount-item">
            {discount.image && (
              <img
                src={discount.image}
                alt={discount.code}
                className="discount-image"
              />
            )}
            <div className="discount-info">
              <h2>{discount.code}</h2>
              <p>Giảm giá: {discount.discount}</p>
              <p>Ngày hết hạn: {discount.expirationDate}</p>
              <p>
               
                Mô tả:
                {discount.description.length > 40
                  ? `${discount.description.slice(0, 40)}...`
                  : discount.description}
              </p>
              <p>Khách sạn áp dụng: {discount.hotels.join(", ")}</p>
            </div>
            <div className="discount-actions">
              <button onClick={() => handleEditButtonClick(discount)}>
                Sửa
              </button>
              <button onClick={() => handleDeleteDiscount(discount.id)}>
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>
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
                placeholder="Phần trăm giảm giá"
              />
              <input
                type="text"
                value={newExpirationDate}
                onChange={(e) => setNewExpirationDate(e.target.value)}
                placeholder="Ngày hết hạn"
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Mô tả"
              />
              <input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="URL hình ảnh"
              />
              <div className="hotel-selector">
                <label>Chọn Khách Sạn:</label>
                <select
                  multiple
                  value={selectedHotels}
                  onChange={(e) => {
                    const selectedOptions = [...e.target.options]
                      .filter((option) => option.selected)
                      .map((option) => option.value);
                    setSelectedHotels(selectedOptions);
                  }}
                >
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.title}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={editMode ? handleEditDiscount : handleAddDiscount}
              >
                {editMode ? "Cập Nhật" : "Thêm"}
              </button>
              {editMode && (
                <button
                  onClick={() => {
                    setEditMode(false);
                    resetForm();
                    setModalOpen(false);
                  }}
                >
                  Hủy
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountPage;
