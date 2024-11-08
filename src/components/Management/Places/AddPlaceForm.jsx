import React, { useState } from "react";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { db, storage } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../../../CSS/Component/Management/Places/AddPlaceForm.css";

export default function AddPlaceForm() {
  const [isTopPlace, setIsTopPlace] = useState(false);
  const [activities, setActivities] = useState([""]);
  const [activeTab, setActiveTab] = useState("general");
  const [images, setImages] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    country: "",
    location: "",
    address: "",
    starRating:"",
    openingHours: "",
    region: "Miền Bắc",
    description: "",
    bestTimeToVisit: "",
    localCurrency: "VND",
    language: "Tiếng Việt",
    averageTemperature: "",
    chanceOfRain: "",
    humidity: "",
    nearestAirport: "",
    publicTransport: "",
    carRental: "",
   
  });

  const handleAddActivity = () => {
    setActivities([...activities, ""]);
  };

  const handleActivityChange = (index, value) => {
    const newActivities = [...activities];
    newActivities[index] = value;
    setActivities(newActivities);
  };

  const handleRemoveActivity = (index) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(newActivities);
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tải ảnh lên Firebase Storage và lấy URL
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        if (image instanceof File) {
          const imageRef = ref(storage, `images/${image.name}`);
          await uploadBytes(imageRef, image);
          return await getDownloadURL(imageRef);
        }
        return null;
      })
    );

    const mainImageUrl = imageUrls.length > 0 ? imageUrls[0] : null; // Đổi tên biến
    const galleryImageUrls = imageUrls.slice(1); // Đổi tên biến

    // Chuẩn bị dữ liệu để lưu vào Firestore
    const placeData = {
      title: formData.name,
      location: formData.location,
      type: formData.type,
      country: formData.country,
      address: formData.address,
      openingHours: formData.openingHours,
      description: formData.description,
      bestTimeToVisit: formData.bestTimeToVisit,
      localCurrency: formData.localCurrency,
      language: formData.language,
      nearestAirport: formData.nearestAirport,
      publicTransport: formData.publicTransport,
      carRental: formData.carRental,
      activities,
      starRating:  "0",
      region: formData.region,
      imageUrl: mainImageUrl, // Đổi tên trường
      gallery: galleryImageUrls, // Đổi tên trường nếu bạn muốn
    };

    try {
      const collectionName = isTopPlace ? "topPlaces" : "places";
      await addDoc(collection(db, collectionName), placeData);
      alert("Địa điểm đã được lưu!");

      // Reset form
      setFormData({
        name: "",
        type: "",
        country: "",
        location: "",
        address: "",
        description: "",
        bestTimeToVisit: "",
        localCurrency: "",
        language: "",
        averageTemperature: "",
        chanceOfRain: "",
        humidity: "",
        nearestAirport: "",
        publicTransport: "",
        carRental: "",
      });
      setActivities([""]);
      setImages([]);
      setIsTopPlace(false);

      // Đóng form sau khi lưu thành công
      setIsFormOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu địa điểm: ", error);
    }
  };

  return (
    <div className="container">
      {isFormOpen && (
        <div className="card-container">
          <div className="card-header">
            <h2 className="card-title">Thêm Địa Điểm Mới</h2>
            <p className="card-description">
              Nhập thông tin chi tiết về địa điểm du lịch mới
            </p>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <div className="top-place-group">
                  <label htmlFor="top-place" className="top-place-title">
                    Đây là Địa Điểm Yêu Thích (Top Place)
                  </label>
                  <input
                    type="checkbox"
                    id="top-place"
                    checked={isTopPlace}
                    onChange={(e) => setIsTopPlace(e.target.checked)}
                  />
                </div>
                {isTopPlace && (
                  <p className="card-description">
                    Địa điểm này sẽ được hiển thị trong danh sách Địa Điểm Yêu
                    Thích trên trang chủ.
                  </p>
                )}
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Tên Địa Điểm
                  </label>
                  <input
                    id="name"
                    className="form-input"
                    placeholder="Nhập tên địa điểm"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="type" className="form-label">
                    Loại Địa Điểm
                  </label>
                  <select
                    id="type"
                    className="form-select"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn loại địa điểm</option>
                    <option value="beach">Bãi biển</option>
                    <option value="mountain">Núi</option>
                    <option value="city">Thành phố</option>
                    <option value="countryside">Nông thôn</option>
                    <option value="historical">Di tích lịch sử</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="country" className="form-label">
                    Quốc gia
                  </label>
                  <input
                    id="country"
                    className="form-input"
                    placeholder="Nhập quốc gia"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Vùng/Tỉnh
                  </label>
                  <input
                    id="location"
                    className="form-input"
                    placeholder="Nhập vùng hoặc tỉnh"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Địa chỉ
                  </label>
                  <input
                    id="address"
                    className="form-input"
                    placeholder="Nhập địa chỉ chi tiết"
                    value={formData.address}
                    onChange={handleInputChange} // Gọi hàm này để cập nhật địa chỉ
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="openingHours" className="form-label">
                    Thời gian mở cửa
                  </label>
                  <input
                    id="openingHours"
                    className="form-input"
                    placeholder="Nhập thời gian mở cửa (VD: 9:00 AM - 5:00 PM)"
                    value={formData.openingHours} // Lấy giá trị từ formData
                    onChange={handleInputChange} // Gọi hàm này để cập nhật thời gian mở cửa
                  />
                </div>
              </div>


              <div className="form-group">
  <label htmlFor="region" className="form-label">
    Chọn miền
  </label>
  <select
    id="region"
    className="form-select"
    value={formData.region}
    onChange={handleInputChange} // Gọi hàm này để cập nhật region
  >
    <option value="Miền Bắc">Miền Bắc</option>
    <option value="Miền Trung">Miền Trung</option>
    <option value="Miền Nam">Miền Nam</option>
  </select>
</div>


              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  className="form-textarea"
                  placeholder="Nhập mô tả về địa điểm"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              

              <div className="form-group">
                <label className="form-label">Hoạt động du lịch</label>
                {activities.map((activity, index) => (
                  <div key={index} className="activity-group">
                    <input
                      value={activity}
                      onChange={(e) =>
                        handleActivityChange(index, e.target.value)
                      }
                      placeholder={`Hoạt động ${index + 1}`}
                      className="form-input"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        className="button button-outline button-icon"
                        onClick={() => handleRemoveActivity(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <div className="add-button-container">
                  <button
                    type="button"
                    className="add-button"
                    onClick={handleAddActivity}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Thêm hoạt động
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Hình ảnh Địa điểm</label>
                <div className="grid-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="image-upload">
                      {images[index] ? (
                        <img
                          src={URL.createObjectURL(images[index])}
                          alt={`Preview ${index + 1}`}
                          className="preview-image"
                        />
                      ) : (
                        <ImageIcon className="mx-auto h-8 w-4" />
                      )}
                      <label
                        htmlFor={`image-${index}`}
                        className="mt-2 cursor-pointer text-blue-600 hover:text-blue-500"
                      >
                        Tải ảnh lên
                        <input
                          id={`image-${index}`}
                          name={`image-${index}`}
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleImageChange(e, index)}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tab-list">
                <button
                  type="button"
                  className={`tab ${activeTab === "general" ? "active" : ""}`}
                  onClick={() => setActiveTab("general")}
                >
                  Thông tin chung
                </button>
                <button
                  type="button"
                  className={`tab ${activeTab === "transport" ? "active" : ""}`}
                  onClick={() => setActiveTab("transport")}
                >
                  Giao thông
                </button>
              </div>

              {activeTab === "general" && (
                <div className="tab-content">
                  <div className="form-group">
                    <label htmlFor="bestTimeToVisit" className="form-label">
                      Thời gian tốt nhất để đến
                    </label>
                    <input
                      id="bestTimeToVisit"
                      className="form-input"
                      placeholder="Ví dụ: Tháng 3 đến tháng 5"
                      value={formData.bestTimeToVisit}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="localCurrency" className="form-label">
                      Tiền tệ địa phương
                    </label>
                    <input
                      id="localCurrency"
                      className="form-input"
                      placeholder="Ví dụ: VND"
                      value={formData.localCurrency}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="language" className="form-label">
                      Ngôn ngữ chính
                    </label>
                    <input
                      id="language"
                      className="form-input"
                      placeholder="Ví dụ: Tiếng Việt"
                      value={formData.language}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {activeTab === "transport" && (
                <div className="tab-content">
                  <div className="form-group">
                    <label htmlFor="nearestAirport" className="form-label">
                      Sân bay gần nhất
                    </label>
                    <input
                      id="nearestAirport"
                      className="form-input"
                      placeholder="Nhập tên sân bay"
                      value={formData.nearestAirport}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="publicTransport" className="form-label">
                      Phương tiện công cộng
                    </label>
                    <input
                      id="publicTransport"
                      className="form-input"
                      placeholder="Nhập thông tin về phương tiện"
                      value={formData.publicTransport}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="carRental" className="form-label">
                      Thuê xe
                    </label>
                    <input
                      id="carRental"
                      className="form-input"
                      placeholder="Thông tin về dịch vụ cho thuê xe"
                      value={formData.carRental}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <button type="submit" className="submit-button">
                  Lưu Địa Điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
