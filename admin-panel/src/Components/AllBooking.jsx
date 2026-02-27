import React, { useEffect, useState } from 'react'
import { allBooking } from '../../api';
import '../stylesheets/AllBooking.css'; // We'll create this CSS file
import { useNavigate, useParams } from 'react-router-dom';

function AllBooking() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // const {id} = useParams();

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await allBooking();
            console.log("API Response:", response.data);
            
            if (response.data.success) {
                setBookings(response.data.data);
            } else {
                setError("Failed to fetch bookings");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setError("Error loading bookings. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    const handleRoute = (id) => {
        navigate(`/details/${id}`)
    }

    useEffect(() => {
        fetchBookings();
    }, []);

    // Format date function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status badge class
    const getStatusClass = (status) => {
        switch (status) {
            case 'Confirmed':
            case 'Booked':
                return 'status-confirmed';
            case 'Pending':
                return 'status-pending';
            case 'Cancelled':
                return 'status-cancelled';
            case 'Completed':
                return 'status-completed';
            default:
                return 'status-default';
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={fetchBookings} className="retry-btn">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="all-bookings-container">
            <div className="bookings-header">
                <h2>All Bookings</h2>
                <div className="header-actions">
                    <span className="total-bookings">
                        Total: {bookings.length} bookings
                    </span>
                    <button onClick={fetchBookings} className="refresh-btn">
                        Refresh
                    </button>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <p>No bookings found</p>
                </div>
            ) : (
                <div className="bookings-table-container">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Check-In</th>
                                <th>Check-Out</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Total Price</th>
                                <th>Created Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td className="booking-id">
                                        {booking._id.substring(0, 8)}...
                                    </td>
                                    <td>{formatDate(booking.checkIn)}</td>
                                    <td>{formatDate(booking.checkOut)}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`payment-status ${booking.paymentStatus === 'Paid' ? 'paid' : 'pending'}`}>
                                            {booking.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="price-cell">
                                        ${booking.totalPrice.toLocaleString()}
                                    </td>
                                    <td>{formatDate(booking.createdAt)}</td>
                                    <td>
                                        <button className="view-btn" onClick={() => handleRoute(booking._id)}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detailed View Modal (Optional) */}
            {/* You can add a modal to show more details when "View Details" is clicked */}
        </div>
    );
}

export default AllBooking;