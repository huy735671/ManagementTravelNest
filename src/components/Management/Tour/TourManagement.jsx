import React, { useEffect, useState } from 'react';
import { db } from '../../../firebaseConfig'; // Import Firestore
import { collection, getDocs } from 'firebase/firestore';
import AddTourForm from './AddTourForm';
import '../../../CSS/Component/Management/Tour/TourManagement.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TourManagement = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [tours, setTours] = useState([]);

    
    const fetchTours = async () => {
        const toursCollection = collection(db, 'tours'); 
        const tourSnapshot = await getDocs(toursCollection);
        const tourList = tourSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTours(tourList);
    };

   
    useEffect(() => {
        fetchTours();
    }, []);

    
    const addTour = (newTour) => {
        setTours([...tours, { id: Date.now(), ...newTour }]);
        setShowAddForm(false);
    };

    // Hàm để giới hạn độ dài tên và mô tả
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; 
    };

    const formatCurrency = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };


    return (
        <div className="tour-management-container">
            <h1>Quản Lý Tour Du Lịch</h1>

            <button onClick={() => setShowAddForm(true)} className="add-tour-button">
                Thêm Tour
            </button>

            {showAddForm && (
                <div className="form-container">
                    <AddTourForm onAddTour={addTour} onCancel={() => setShowAddForm(false)} />
                </div>
            )}

            <h2>Danh Sách Tour</h2>
            <table className="tour-table">
                <thead>
                    <tr>
                        <th>Tên Tour</th>
                        <th>Mô tả</th>
                        <th>Giá/người</th>
                        <th>Liên hệ</th>
                        <th>Ngày khởi hành</th>
                        <th>Ngày Kết thúc</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {tours.map((tour) => (
                        <tr key={tour.id}>
                            <td>{truncateText(tour.name, 20)}</td>
                            <td>{truncateText(tour.description, 50)}</td> 
                            <td>{formatCurrency(tour.price)}đ</td>
                            <td>{tour.contact}</td>
                            <td>{formatDate(tour.startDate)}</td>
                            <td>{formatDate(tour.endDate)}</td>
                            <td>
                                <button className="icon-button" title="Chỉnh sửa">
                                    <FaEdit />
                                </button>
                                <button className="icon-button" title="Xóa">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TourManagement;