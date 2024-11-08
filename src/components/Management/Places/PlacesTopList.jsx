import React from 'react';
import '../../../CSS/Component/Management/Places/PlacesList.css';

const PlacesList = ({ topPlaces, handleEditPlace }) => { // Xóa handleDeletePlace khỏi tham số
  return (
    <div className="all-places-list">
      {topPlaces.map(place => (
        <div key={place.id} className="all-place-item">
          <img src={place.imageUrl} alt={place.title} className="place-image" />
          <div className="place-info">
            <h2>{place.title}</h2>
            <p>{place.location}</p>
            <p>{place.description}</p>
            <div className="button-container">
              <button onClick={() => handleEditPlace(place.id, place)} className="edit-button">Sửa</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlacesList;
