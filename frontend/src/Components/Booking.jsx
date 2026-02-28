import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { allBooking, cancelbooking, checkoutbooking } from "../../api";
import "../stylesheets/Booking.css";

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await allBooking();
      const data = res.data.data;

      if (Array.isArray(data)) {
        setBookings(data);
      } else if (data.success && Array.isArray(data.data)) {
        setBookings(data.data);
      } else {
        setBookings([]);
      }

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const cancelBooking = async (id) => {
    try {
      await cancelbooking(id);
      setBookings((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "Cancelled" } : item
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking!");
    }
  };

  // Checkout booking
//  const CheckOutBooking = async (id) => {
//   try {
//     const request = await checkoutbooking(id);
//     const response = request.data;

//     if (response.success) {
//       setBookings((prev) =>
//         prev.map((item) =>
//           item._id === id ? { ...item, status: "Completed" } : item
//         )
//       );
//       alert("Checked out successfully!");
//     } else {
//       alert(response.message);
//     }
//   } catch (error) {
//     console.log(error);
//     alert("Something went wrong!");
//   }
// };
const CheckOutBooking = async (id) => {
  try {
    const request = await checkoutbooking(id);
    const response = request.data;

    if (response.success) {
      setBookings((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "Completed" } : item
        )
      );
      alert("Checked out successfully!");
    }
  } catch (error) {
    console.log(error);

    // 400 ka matlab abhi checkout time nahi aaya
    if (error.response && error.response.status === 400) {
      alert(error.response.data.message); // ✅ "Check-out time not reached yet"
    } else {
      alert("Something went wrong!");
    }
  }
};




  // Status logic
  const getStatus = (booking) => {
    if (booking.status === "Cancelled") return "Cancelled";

    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const now = new Date();

    if (now < checkIn) return "Booked";
    if (now >= checkIn && now < checkOut) return "Active";
    return "Completed";
  };

  // Cancel allowed only within 10 minutes of booking creation
  const canCancel = (booking) => {
    const createdAt = new Date(booking.createdAt);
    const now = new Date();
    const diffInMinutes = (now - createdAt) / (1000 * 60);
    return diffInMinutes <= 10 && booking.status !== "Cancelled";
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p className="booking-loading">Loading bookings...</p>;
  if (error)
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchBookings}>Retry</button>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="booking-container">
        <h1>My Bookings</h1>

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((item) => (
            <div className="booking-card" key={item._id}>
              <h3>{item.room?.name || "N/A"}</h3>
              <p>
                <strong>Hotel:</strong> {item.hotel?.name || "N/A"}
              </p>
              <p>
                <strong>Price:</strong> ₹{item.totalPrice}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${getStatus(item).toLowerCase()}`}>
                  {getStatus(item)}
                </span>
              </p>

              {/* Checkout button for Active bookings */}
              {getStatus(item) === "Active" && (
                <button
                  className="checkout-btn"
                  onClick={() => CheckOutBooking(item._id)}
                >
                  Checkout
                </button>
              )}

              {/* Cancel button within 10 minutes */}
              {canCancel(item) && (
                <button
                  className="cancel-btn"
                  onClick={() => cancelBooking(item._id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Booking;
