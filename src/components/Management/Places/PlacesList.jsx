import React, { useEffect, useState } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import '../../../CSS/Component/Management/Places/PlacesList.css';

const PlacesList = () => {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [placesPerPage] = useState(6);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  const fetchPlaces = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'places'));
      const placesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPlaces(placesData);
    } catch (error) {
      console.error("Error fetching places: ", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = places.slice(indexOfFirstPlace, indexOfLastPlace);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(places.length / placesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleEdit = (place) => {
    setSelectedPlace(place);
    setIsEditing(true);
  };

  const handleDelete = async (placeId) => {
    try {
      await deleteDoc(doc(db, 'places', placeId));
      fetchPlaces();
    } catch (error) {
      console.error("Error deleting place: ", error);
    }
  };

  const handleSave = async () => {
    try {
      const placeRef = doc(db, 'places', selectedPlace.id);
      await updateDoc(placeRef, {
        image: selectedPlace.image,
        title: selectedPlace.title,
        description: selectedPlace.description,
        location: selectedPlace.location,
        gallery: selectedPlace.gallery
      });
      setIsEditing(false);
      fetchPlaces();
    } catch (error) {
      console.error("Error updating place: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlace(prev => ({ ...prev, [name]: value }));
  };

  const handleGalleryChange = (e) => {
    const { value } = e.target;
    setSelectedPlace(prev => ({ ...prev, gallery: value.split(',') }));
  };

  const openLightbox = (image) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const handleImageDelete = (index) => {
    const newGallery = selectedPlace.gallery.filter((_, i) => i !== index);
    setSelectedPlace(prev => ({ ...prev, gallery: newGallery }));
  };

  return (
    <div className="place-details-list">
      <h2>Danh sách các địa điểm</h2>
      <div className="all-places-list">
        {currentPlaces.map(place => (
          <div className="all-place-item" key={place.id}>
            <img src={place.imageUrl} alt={place.title} className="place-image" onClick={() => openLightbox(place.imageUrl)} />
            <div className="place-info">
              <h3>{place.title}</h3>
              <p>{place.description}</p>
              <p><strong>Vị trí:</strong> {place.location}</p>
              <div className="button-container">
                <button className="edit-button" onClick={() => handleEdit(place)}>Sửa</button>
                <button className="edit-button" onClick={() => handleDelete(place.id)}>Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => paginate(number)} className="pagination-button">
            {number}
          </button>
        ))}
      </div>

      {/* Modal overlay */}
      {isEditing && selectedPlace && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="image-section">
              <img src={selectedPlace.image} alt={selectedPlace.title} />
              <div className="gallery">
                {selectedPlace.gallery && selectedPlace.gallery.map((url, index) => (
                  <div key={index} className="gallery-item">
                    <img src={url} alt={`Gallery ${index}`} onClick={() => openLightbox(url)} />
                    <span className="delete-icon" onClick={() => handleImageDelete(index)}>×</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="info-section">
              <h3>Chỉnh sửa địa điểm</h3>
              <input
                type="text"
                name="title"
                value={selectedPlace.title}
                onChange={handleInputChange}
                placeholder="Tiêu đề"
              />
              <textarea
                name="description"
                value={selectedPlace.description}
                onChange={handleInputChange}
                placeholder="Mô tả"
              />
              <input
                type="text"
                name="location"
                value={selectedPlace.location}
                onChange={handleInputChange}
                placeholder="Vị trí"
              />
              <input
                type="text"
                name="image"
                value={selectedPlace.image}
                onChange={handleInputChange}
                placeholder="URL hình ảnh chính"
              />
              <input
                type="text"
                name="gallery"
                value={selectedPlace.gallery.join(', ')}
                onChange={handleGalleryChange}
                placeholder="URL hình ảnh phụ (phân cách bởi dấu phẩy)"
              />
              <button onClick={handleSave}>Lưu</button>
              <button className="cancel" onClick={() => setIsEditing(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for large image view */}
      {lightboxImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <img src={lightboxImage} alt="Lightbox" />
          <span className="close-lightbox" onClick={closeLightbox}>×</span>
        </div>
      )}
    </div>
  );
};

export default PlacesList;
