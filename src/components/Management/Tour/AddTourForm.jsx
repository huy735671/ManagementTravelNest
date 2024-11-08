import React, { useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddTourForm = ({ onAddTour, onCancel }) => {
  const [tour, setTour] = useState({
    name: "",
    description: "",
    itinerary: "",
    price: "",
    guide: "",
    contact: "",
    startDate: "",
    endDate: "",
    departure: "", 
    destination: "", 
    transportation: "",
    meals: "",
    cancellationPolicy: "",
    duration: "",
    location:"",
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTour({ ...tour, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = Object.values(tour).every((value) => value.trim() !== "") && images.length > 0;

    if (!isFormValid) {
        alert("Vui lòng điền đầy đủ thông tin và chọn hình ảnh.");
        return;
    }

    try {
        const imageUrls = await Promise.all(images.map(async (file) => {
            const storage = getStorage();
            const storageRef = ref(storage, `images/${file.name}`);
            await uploadBytes(storageRef, file);
            return await getDownloadURL(storageRef);
        }));

        const toursCollection = collection(db, "tours");
        const docRef = await addDoc(toursCollection, { ...tour, images: imageUrls });
        console.log("Tour added with ID: ", docRef.id);
        alert("Thêm tour thành công!");
        onAddTour({ ...tour, images: imageUrls });
        setTour({ 
            // Reset lại tour sau khi thêm
            name: "",
            description: "",
            itinerary: "",
            price: "",
            guide: "",
            contact: "",
            startDate: "",
            endDate: "",
            departure: "",
            destination: "",
            transportation: "",
            meals: "",
            cancellationPolicy: "",
            duration: "",
            location:"",
        });
        setImages([]); 
    } catch (error) {
        console.error("Error adding tour: ", error);
        alert("Đã xảy ra lỗi khi thêm tour. Vui lòng thử lại.");
    }
};

  return (
    <div style={overlayStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={titleStyle}>Thêm Tour Mới</h2>

        <div style={gridContainerStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Tên Tour</label>
            <input
              type="text"
              name="name"
              placeholder="Nhập tên tour"
              value={tour.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Giá/ Người (VND)</label>
            <input
              type="number"
              name="price"
              placeholder="Nhập giá tour của 1 người"
              value={tour.price}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Hướng Dẫn Viên</label>
            <input
              type="text"
              name="guide"
              placeholder="Thông tin về hướng dẫn viên"
              value={tour.guide}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Liên Hệ</label>
            <input
              type="text"
              name="contact"
              placeholder="Nhập số điện thoại liên lạc"
              value={tour.contact}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Ngày Bắt Đầu</label>
            <input
              type="date"
              name="startDate"
              value={tour.startDate}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Ngày Kết Thúc</label>
            <input
              type="date"
              name="endDate"
      
              value={tour.endDate}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Khởi Hành Từ</label>
            <input
              type="text"
              name="departure"
              placeholder="Địa điểm bắt đầu chuyến tour"

              value={tour.departure}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Điểm Kết Thúc</label>
            <input
              type="text"
              name="destination"
              placeholder="Điểm kết thúc chuyến du lịch"
              value={tour.destination}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Phương Tiện Di Chuyển</label>
            <input
              type="text"
              name="transportation"
              placeholder="Phương tiện đưa đón khách du lịch"
              value={tour.transportation}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Thông Tin Bữa Ăn</label>
            <input
              type="text"
              name="meals"
              placeholder="Nhập thông tin bữa ăn"
              value={tour.meals}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Số Ngày</label>
            <input
              type="text"
              name="duration"
              placeholder="Nhập số ngày đêm của tour"
              value={tour.duration}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Tỉnh vùng tham quan</label>
            <input
              type="text"
              name="location"
              placeholder="Nhập tỉnh, vùng, thành phố tour"
              value={tour.location}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        </div>

        <div style={longInputContainerStyle}>
          <label style={labelStyle}>Mô Tả</label>
          <textarea 
            name="description" 
            value={tour.description}
            placeholder="Nhập mô tả tour du lịch..."
            onChange={handleChange} 
            style={{ height: '150px', marginBottom: '15px', width: '97%' , borderRadius:'10px', padding:'10px'}} 
          />
        </div>

        <div style={longInputContainerStyle}>
          <label style={labelStyle}>Lịch Trình Tour</label>
          <textarea 
            name="itinerary" 
            value={tour.itinerary}
            placeholder="Nhập lịch trình theo từng ngày của tour..." 
            onChange={handleChange} 
            style={{ height: '150px', marginBottom: '15px', width: '97%' , borderRadius:'10px', padding:'10px'}} 
          />
        </div>
        
        <div style={longInputContainerStyle}>
        <label style={labelStyle}>Chính Sách Hủy Tour</label>
        <textarea 
            name="cancellationPolicy" 
            value={tour.cancellationPolicy} 
            placeholder="Nhập chính sách hủy tour..."
            onChange={handleChange} 
            style={{ height: '150px', marginBottom: '15px', width: '97%', borderRadius:'10px', padding:'10px'}} 
          />
        </div>

        <div style={imageSectionStyle}>
          <label style={labelStyle}>Hình Ảnh</label>
          <input
            type="file"
            id="fileInput"
            multiple
            onChange={handleImageChange}
            style={inputStyle}
            hidden
          />

          <div style={imagePreviewContainerStyle}>
            {images.map((image, index) => (
              <div key={index} style={imageWrapperStyle}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`preview ${index}`}
                  style={imagePreviewStyle}
                />
              </div>
            ))}
            <div style={imageWrapperStyle} onClick={handleImageClick}>
              <div style={placeholderStyle}>Chọn hình ảnh</div>
            </div>
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <button type="submit" style={submitButtonStyle} >
            Thêm Tour
          </button>
          <button type="button" onClick={onCancel} style={cancelButtonStyle}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

const placeholderStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign:'center',
  border: "1px dashed #ccc",
  borderRadius: "6px",
  color: "#aaa",
  cursor: "pointer",
};

const imagePreviewContainerStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const overlayStyle = {
  position: "fixed",
  top:40,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const formStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "90%",
  maxWidth: "700px",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
  fontFamily: "Arial, sans-serif",
  color: "#333",
  maxHeight: "80vh",
  overflowY: "auto",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "1.5em",
  color: "#333",
};

const gridContainerStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
  marginBottom:"20px",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  fontWeight: "bold",
  fontSize: "0.9em",
  marginBottom: "5px",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "1em",
};

const longInputContainerStyle = {
  marginBottom: "10px",
  fontSize: "1.1em",
};



const imageSectionStyle = {
  marginBottom: "15px",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
};

const submitButtonStyle = {
  padding: "10px 15px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#4CAF50",
  color: "#fff",
  fontSize: "1em",
  cursor: "pointer",
};

const cancelButtonStyle = {
  padding: "10px 15px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#f44336",
  color: "#fff",
  fontSize: "1em",
  cursor: "pointer",
};

const imageWrapperStyle = {
  position: "relative",
  width: "220px",
  height: "150px",
};

const imagePreviewStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: "6px",
};

export default AddTourForm;
