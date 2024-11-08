import React, { useEffect, useState, useCallback } from 'react';
import { db, auth } from '../../../../firebaseConfig';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore';

const DiscountManager = () => {
    const [rooms, setRooms] = useState([]);
    const [hotelName, setHotelName] = useState('');
    const [hotelId, setHotelId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [discounts, setDiscounts] = useState({});
    const [discountList, setDiscountList] = useState([]);
    const [startDate, setStartDate] = useState({});
    const [endDate, setEndDate] = useState({});

    const fetchHotelData = useCallback(async () => {
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (user) {
                const userEmail = user.email;

                // Fetch hotel name and id
                const hotelQuery = query(collection(db, "hotels"), where("partner", "==", userEmail));
                const hotelSnapshot = await getDocs(hotelQuery);

                if (!hotelSnapshot.empty) {
                    const hotelData = hotelSnapshot.docs[0].data();
                    setHotelName(hotelData.title);
                    setHotelId(hotelSnapshot.docs[0].id);

                    // Fetch room data
                    const roomsQuery = query(collection(db, "rooms"), where("hotelId", "==", hotelId));
                    const roomsSnapshot = await getDocs(roomsQuery);
                    const roomsList = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setRooms(roomsList);

                    // Fetch discount data from hotelDiscount collection
                    const discountQuery = query(collection(db, "hotelDiscount"), where("hotelId", "==", hotelId));
                    const discountSnapshot = await getDocs(discountQuery);
                    const discountData = discountSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setDiscountList(discountData);
                } else {
                    setError("Không tìm thấy khách sạn nào liên kết với tài khoản này.");
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError("Có lỗi khi tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    }, [hotelId]);

    useEffect(() => {
        fetchHotelData();
    }, [fetchHotelData]);

    const handleDiscountChange = (roomId, value) => {
        setDiscounts(prev => ({ ...prev, [roomId]: value }));
    };

    const handleStartDateChange = (roomId, value) => {
        setStartDate(prev => ({ ...prev, [roomId]: value }));
    };

    const handleEndDateChange = (roomId, value) => {
        setEndDate(prev => ({ ...prev, [roomId]: value }));
    };

    const handleSubmit = async (roomId) => {
        const currentRoom = rooms.find(room => room.id === roomId);
        const originalPrice = parseInt(currentRoom.pricePerNight);
        const discountPercentage = parseInt(discounts[roomId]) || 0;
        const start = startDate[roomId];
        const end = endDate[roomId];

        // Lưu giảm giá vào Firestore trong collection hotelDiscount
        await addDoc(collection(db, 'hotelDiscount'), {
            hotelId,
            roomId,
            originalPrice,
            discountPercentage,
            startDate: start,
            endDate: end,
        });

        alert(`Giảm giá cho phòng ${currentRoom.roomNumber} đã được cập nhật!`);
        fetchHotelData(); // Tải lại dữ liệu để cập nhật danh sách giảm giá
    };

    const handleDeleteDiscount = async (discountId) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa giảm giá này?');
        if (confirmDelete) {
            await deleteDoc(doc(db, 'hotelDiscount', discountId));
            alert('Giảm giá đã được xóa thành công');
            fetchHotelData(); // Tải lại dữ liệu để cập nhật danh sách giảm giá
        }
    };

    return (
        <div>
            <h1>Quản lý giảm giá phòng - Khách sạn: {hotelName}</h1>
            {loading ? (
                <h2>Đang tải...</h2>
            ) : error ? (
                <h2>{error}</h2>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Số Phòng</th>
                                <th>Loại Phòng</th>
                                <th>% Giảm Giá</th>
                                <th>Ngày Bắt Đầu</th>
                                <th>Ngày Kết Thúc</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map(room => (
                                <tr key={room.id}>
                                    <td>{room.roomNumber}</td>
                                    <td>{room.roomType}</td>
                                    <td>
                                        <input 
                                            type="number" 
                                            placeholder="Giảm giá (%)" 
                                            onChange={(e) => handleDiscountChange(room.id, e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="date" 
                                            onChange={(e) => handleStartDateChange(room.id, e.target.value)} 
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="date" 
                                            onChange={(e) => handleEndDateChange(room.id, e.target.value)} 
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => handleSubmit(room.id)}>Cập nhật</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2>Danh sách giảm giá hiện tại:</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>ID Giảm Giá</th>
                                <th>ID Phòng</th>
                                <th>Giá Gốc</th>
                                <th>Giảm Giá (%)</th>
                                <th>Ngày Bắt Đầu</th>
                                <th>Ngày Kết Thúc</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discountList.map(discount => (
                                <tr key={discount.id}>
                                    <td>{discount.id}</td>
                                    <td>{discount.roomId}</td>
                                    <td>{discount.originalPrice} VND</td>
                                    <td>{discount.discountPercentage} %</td>
                                    <td>{discount.startDate}</td>
                                    <td>{discount.endDate}</td>
                                    <td>
                                        <button onClick={() => handleDeleteDiscount(discount.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default DiscountManager;
