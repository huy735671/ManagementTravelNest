import React, { useState, useEffect } from 'react';
import AddPlaceForm from './Places/AddPlaceForm';
import PlacesTopList from './Places/PlacesTopList';
import PlacesList from './Places/PlacesList';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import '../../CSS/Component/Management/PlacesPage.css';

const PlacesPage = () => {
  const [topPlaces, setTopPlaces] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [viewDetails, setViewDetails] = useState(false); // Trạng thái để chuyển đổi

  const fetchPlaces = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'topPlaces'));
      const places = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTopPlaces(places);
    } catch (error) {
      console.error("Error fetching places: ", error);
    }
  };

  const handleDeletePlace = async (id) => {
    try {
      await deleteDoc(doc(db, 'topPlaces', id));
      setTopPlaces(topPlaces.filter(place => place.id !== id));
    } catch (error) {
      console.error("Error deleting place: ", error);
    }
  };

  const handleEditPlace = (id, place) => {
    console.log('Edit place:', id, place);
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  return (
    <div className="places-page">
      <header className="places-header">
        <h1>Quản lý địa điểm</h1>
        <div> 
          <button onClick={() => setIsAdding(!isAdding)} className="toggle-add-button">
            {isAdding ? 'Hủy thêm địa điểm' : 'Thêm địa điểm'}
          </button>
          <button onClick={() => setViewDetails(!viewDetails)} className="toggle-view-button">
            {viewDetails ? 'Xem danh sách yêu thích' : 'Xem danh sách địa điểm'}
          </button>
        </div>
      </header>

      {isAdding && (
        
        <AddPlaceForm
          setTopPlaces={setTopPlaces}
          topPlaces={topPlaces}
          setIsAdding={setIsAdding}
        />
      )}

      {!viewDetails ? (
        
        <PlacesTopList
          topPlaces={topPlaces}
          handleEditPlace={handleEditPlace}
          handleDeletePlace={handleDeletePlace}
        />
      ) : (
        <PlacesList />
      )}
    </div>
  );
};

export default PlacesPage;