import React, {  useEffect, useState } from "react";
import Modal from "react-modal";
import { db, storage } from "../../../firebaseConfig"; // Import Firestore
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"; // Import các hàm Firestore
import styles from "../../../CSS/Component/Management/Hotel/AddHotel.module.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import các hàm Storage

Modal.setAppElement("#root");

export default function AddHotel() {
  const [partnerType, setPartnerType] = useState("existing");
  const [partnerAccounts, setPartnerAccounts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    hotelType: "",
    address: "",
    location: "",
    starRating: "",
    pricePerNight: "",
    description: "",
    amenities: [],
    partnerAccount: "",
    newPartnerName: "",
    newPartnerEmail: "",
    images: [],
  });
  useEffect(() => {
    const loadPartnerAccounts = async () => {
      const accounts = await fetchPartnerAccounts();
      setPartnerAccounts(accounts);
    };

    loadPartnerAccounts();
  }, []);
  const fetchPartnerAccounts = async () => {
    try {
      const partnerAccounts = [];
      const q = query(collection(db, "users"), where("role", "==", "partner"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        partnerAccounts.push({ id: doc.id, ...doc.data() });
      });
      return partnerAccounts;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản đối tác: ", error);
      return [];
    }
  };
  
  const formatPrice = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "pricePerNight") {
      const numericValue = value.replace(/[^0-9]/g, ""); // Loại bỏ ký tự không phải số
      setFormData({
        ...formData,
        [name]: formatPrice(numericValue), // Định dạng lại giá mỗi khi nhập
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const amenities = prevData.amenities.includes(value)
        ? prevData.amenities.filter((amenity) => amenity !== value)
        : [...prevData.amenities, value];
      return { ...prevData, amenities };
    });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra nếu có hình ảnh trước khi tải lên
      const imageUrls = await Promise.all(
        formData.images.map((image) => uploadImage(image))
      );
  
      // Tạo đối tượng dữ liệu khách sạn
      const hotelData = {
        ...formData,
        imageUrl: imageUrls[0], // Hình ảnh đầu tiên là hình đại diện
        gallery: imageUrls.slice(1), // Các hình ảnh còn lại
      };
  
      // Xóa trường images nếu có
      delete hotelData.images;
  
      // Lưu vào Firestore
      await addDoc(collection(db, "hotels"), hotelData);
  
      // Reset form hoặc hiển thị thông báo thành công
      setFormData({
        title: "",
        hotelType: "",
        address: "",
        location: "",
        starRating: "",
        pricePerNight: "",
        description: "",
        amenities: [],
        partnerAccount: "",
        newPartnerName: "",
        newPartnerEmail: "",
        images: [],
      });
      alert("Khách sạn đã được lưu thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu khách sạn: ", error);
      alert("Đã xảy ra lỗi khi lưu khách sạn. Vui lòng kiểm tra và thử lại.");
    }
  };
  
  

  const uploadImage = async (image) => {
    try {
      const imageRef = ref(storage, `hotels/${Date.now()}_${image.name}`); // Đổi tên file để không bị ghi đè
      await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error("Lỗi khi tải hình ảnh lên:", error);
      throw error; // Để có thể bắt lỗi ở nơi gọi
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Thêm Khách sạn Mới</h2>
          <p className={styles.cardDescription}>
            Nhập thông tin chi tiết về khách sạn mới và liên kết với tài khoản
            đối tác
          </p>
        </div>
        <div className={styles.cardContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Thông tin Khách sạn</h3>
              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>
                    Tên Khách sạn
                  </label>
                  <input
                    id="title"
                    name="title"
                    className={styles.input}
                    placeholder="Nhập tên khách sạn"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="hotelType" className={styles.label}>
                    Loại Khách sạn
                  </label>
                  <select
                    id="hotelType"
                    name="hotelType"
                    className={styles.select}
                    value={formData.hotelType}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn loại khách sạn</option>
                    <option value="resort">Resort</option>
                    <option value="business">Khách sạn Doanh nhân</option>
                    <option value="Villa">Biệt thự</option>
                    <option value="apartment">Căn hộ Dịch vụ</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="address" className={styles.label}>
                    Địa chỉ
                  </label>
                  <input
                    id="address"
                    name="address"
                    className={styles.input}
                    placeholder="Nhập địa chỉ khách sạn"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="location" className={styles.label}>
                    Thành phố
                  </label>
                  <input
                    id="location"
                    name="location"
                    className={styles.input}
                    placeholder="Nhập thành phố"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="starRating" className={styles.label}>
                    Xếp hạng Sao
                  </label>
                  <select
                    id="starRating"
                    name="starRating"
                    className={styles.select}
                    value={formData.starRating}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn xếp hạng</option>
                    <option value="1">1 Sao</option>
                    <option value="2">2 Sao</option>
                    <option value="3">3 Sao</option>
                    <option value="4">4 Sao</option>
                    <option value="5">5 Sao</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="pricePerNight" className={styles.label}>
                    Giá mỗi đêm
                  </label>
                  <input
                    id="pricePerNight"
                    name="pricePerNight"
                    className={styles.input}
                    placeholder="Nhập giá mỗi đêm"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  className={styles.textarea}
                  placeholder="Nhập mô tả về khách sạn"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tiện nghi</label>
                <div className={styles.checkboxGrid}>
                  {[
                    "Wi-Fi",
                    "Bể bơi",
                    "Phòng Gym",
                    "Nhà hàng",
                    "Spa",
                    "Bãi đỗ xe",
                  ].map((amenity) => (
                    <label key={amenity} className={styles.checkbox}>
                      <input
                        type="checkbox"
                        value={amenity}
                        onChange={handleCheckboxChange}
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                Liên kết Tài khoản Đối tác
              </h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Chọn loại tài khoản</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radio}>
                    <input
                      type="radio"
                      name="partnerType"
                      value="existing"
                      checked={partnerType === "existing"}
                      onChange={() => setPartnerType("existing")}
                    />
                    <span>Tài khoản hiện có</span>
                  </label>
                  <label className={styles.radio}>
                    <input
                      type="radio"
                      name="partnerType"
                      value="new"
                      checked={partnerType === "new"}
                      onChange={() => setPartnerType("new")}
                    />
                    <span>Tạo tài khoản mới</span>
                  </label>
                </div>
              </div>
              {partnerType === "existing" ? (
  <div className={styles.formGroup}>
    <label htmlFor="partnerAccount" className={styles.label}>
      Tài khoản Đối tác
    </label>
    <select
      id="partnerAccount"
      name="partnerAccount"
      className={styles.select}
      value={formData.partnerAccount}
      onChange={handleInputChange}
    >
      <option value="">Chọn tài khoản đối tác</option>
      {partnerAccounts.map((account) => (
        <option key={account.id} value={account.id}>
          {account.username} - {account.email} {/* Bạn có thể thay đổi theo thông tin bạn muốn hiển thị */}
        </option>
      ))}
    </select>
  </div>
              ) : (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="newPartnerName" className={styles.label}>
                      Tên Đối tác Mới
                    </label>
                    <input
                      id="newPartnerName"
                      name="newPartnerName"
                      className={styles.input}
                      placeholder="Nhập tên đối tác mới"
                      value={formData.newPartnerName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="newPartnerEmail" className={styles.label}>
                      Email Đối tác
                    </label>
                    <input
                      id="newPartnerEmail"
                      name="newPartnerEmail"
                      type="email"
                      className={styles.input}
                      placeholder="Nhập email đối tác"
                      value={formData.newPartnerEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Hình ảnh Khách sạn</h3>
              <div className={styles.imageGrid}>
                {formData.images.map((image, index) => (
                  <div key={index} className={styles.imagePreview}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index}`}
                      className={styles.image}
                    />
                  </div>
                ))}
                {formData.images.length < 6 && ( // Giới hạn số lượng ô tải ảnh lên
                  <div className={styles.imageUpload}>
                    <label
                      htmlFor={`image-${formData.images.length}`}
                      className={styles.imageLabel}
                    >
                      Tải ảnh lên
                      <input
                        id={`image-${formData.images.length}`}
                        name={`image-${formData.images.length}`}
                        type="file"
                        className={styles.imageInput}
                        onChange={handleImageChange}
                        multiple
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonOutline}`}
              >
                Hủy
              </button>
              <button type="submit" className={styles.button}>
                Lưu Khách sạn
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
