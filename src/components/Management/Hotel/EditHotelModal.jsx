import React, { useState } from 'react';
import '../../../CSS/Component/Management/Hotel/EditHotelModal.css';
import { FaTimes } from 'react-icons/fa'; // Import icon xóa
import { doc, updateDoc } from 'firebase/firestore'; // Firebase imports
import { db } from '../../../firebaseConfig'; // Đường dẫn tới file config firebase
import { toast } from 'react-toastify'; // Import toast notification
import 'react-toastify/dist/ReactToastify.css';

const EditHotelModal = ({ hotel, onClose, onUpdate }) => {
    const [hotelName, sethotelName] = useState(hotel.hotelName);
    const [imageUrl, setImageUrl] = useState(hotel.imageUrl);
    const [address, setAddress] = useState(hotel.address);
    const [price, setPrice] = useState(hotel.price);
    const [description, setDescription] = useState(hotel.description || '');
    const [gallery, setGallery] = useState(hotel.gallery || []);
    const [isImageVisible, setIsImageVisible] = useState(true);

    const handleSave = async () => {
      try {
          const hotelRef = doc(db, "hotels", hotel.id);
          await updateDoc(hotelRef, {
              hotelName,
              imageUrl,
              address,
              price,
              description,
              gallery,
          });

          // Hiển thị thông báo thành công
          toast.success("Cập nhật khách sạn thành công!", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
          });

          onUpdate({ ...hotel, hotelName, imageUrl, address, price, description, gallery });
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

    const toggleImageVisibility = () => {
        setIsImageVisible(!isImageVisible);
    };

    return (
        <div className="edit-hotel-modal">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>×</button>
                <div className="modal-body">
                    {isImageVisible && (
                        <div className="images-container">
                            <div className="main-image-wrapper">
                                <img src={imageUrl} alt={hotelName} className="main-image" />
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
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="image-upload"
                                        id="main-image-upload"
                                    />
                                    <label htmlFor="main-image-upload" className="upload-button">
                                        Sửa Hình Chính
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleGalleryImageUpload}
                                        className="gallery-upload"
                                        id="gallery-image-upload"
                                    />
                                    <label htmlFor="gallery-image-upload" className="upload-button">
                                        Thêm Hình Phụ
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <button className="toggle-image-visibility" onClick={toggleImageVisibility}>
                        {isImageVisible ? 'Ẩn Hình Ảnh' : 'Hiện Hình Ảnh'}
                    </button>

                    <div className="hotel-details">
                        <label>
                            Tiêu Đề:
                            <input
                                type="text"
                                value={hotelName}
                                onChange={(e) => sethotelName(e.target.value)}
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
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
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
                        <button onClick={handleSave} className="save-button">Lưu Thay Đổi</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditHotelModal;
