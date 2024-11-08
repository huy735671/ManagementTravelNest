import React, { useState, useEffect } from "react";
import "../../../CSS/Component/Management/Hotel/EditHotelModal.css";
import { FaTimes } from "react-icons/fa";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditHotelModal = ({ hotel, onClose, onUpdate }) => {
  const [title, setTitle] = useState(hotel.title);
  const [imageUrl, setImageUrl] = useState(hotel.imageUrl);
  const [address, setAddress] = useState(hotel.address);
  const [pricePerNight, setPricePerNight] = useState(hotel.pricePerNight);
  const [description, setDescription] = useState(hotel.description || "");
  const [gallery, setGallery] = useState(hotel.gallery || []);
  const [partner, setPartner] = useState(hotel.partner || "");
  const [partnersList, setPartnersList] = useState([]); // State for partners list
  const [loading, setLoading] = useState(true); // State for loading status

  // Fetch partners from Firestore
  const fetchPartners = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "partner"));
      const querySnapshot = await getDocs(q);
      const partners = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPartnersList(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast.error("Lỗi khi lấy danh sách đối tác.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners(); // Call fetchPartners on component mount
  }, []);

  const handleSave = async () => {
    try {
      const hotelRef = doc(db, "hotels", hotel.id);
      await updateDoc(hotelRef, {
        title,
        imageUrl,
        address,
        pricePerNight,
        description,
        gallery,
        partner,
      });

      toast.success("Cập nhật khách sạn thành công!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      onUpdate({
        ...hotel,
        title,
        imageUrl,
        address,
        pricePerNight,
        description,
        gallery,
        partner,
      });
      onClose();
    } catch (error) {
      toast.error("Lỗi khi cập nhật khách sạn. Vui lòng thử lại!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Lỗi khi lưu thông tin khách sạn:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGallery([...gallery, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  return (
    <div className="edit-hotel-container">
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
      <div className="hotel-details">
        <div className="left-column">
          <div className="images-container">
            <div className="main-image-wrapper">
              <img src={imageUrl} alt={title} className="main-image" />
            </div>
            <div className="gallery">
              <div className="gallery-thumbnails">
                {gallery.map((image, index) => (
                  <div key={index} className="gallery-thumbnail-wrapper">
                    <img
                      src={image}
                      alt={`Gallery ${index}`}
                      className="gallery-thumbnail"
                    />
                    <button
                      className="remove-image-btn"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
              <div className="upload-buttons">
                <label htmlFor="main-image-upload" className="upload-button">
                  Sửa Hình Chính
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="image-upload"
                  id="main-image-upload"
                  style={{ display: "none" }} // Ẩn input file
                />
                <label htmlFor="gallery-image-upload" className="upload-button">
                  Thêm Hình Phụ
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryImageUpload}
                  className="gallery-upload"
                  id="gallery-image-upload"
                  style={{ display: "none" }} // Ẩn input file
                />
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          <label>
            Tiêu Đề:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="detail-input"
            />
          </label>
          <label>
            Địa Chỉ:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="detail-input"
            />
          </label>
          <label>
            Giá:
            <input
              type="text"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              className="detail-input"
            />
          </label>
          <label>
            Mô Tả:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="detail-input description-input"
            />
          </label>
          <label>
            Đối Tác:
            {loading ? (
              <p>Loading...</p>
            ) : (
              <select
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                className="detail-input"
              >
                <option value="">Chọn đối tác</option>
                {partnersList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {`${p.username || ""} (${p.email || ""})`}
                  </option>
                ))}
              </select>
            )}
          </label>
          <button onClick={handleSave} className="save-button">
            Lưu Thay Đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHotelModal;
