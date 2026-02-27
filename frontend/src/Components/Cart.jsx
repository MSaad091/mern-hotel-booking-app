import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookingRoom } from '../../api';
import { toast } from 'react-toastify';
import '../stylesheets/Cart.css';
import Navbar from './Navbar';

function Cart() {
  const { id } = useParams(); // room ID from URL
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking,setBooking] = useState(false)
  const navigate = useNavigate()

  // Automatically set checkIn = today, checkOut = tomorrow
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    setCheckIn(formatDate(today));
    setCheckOut(formatDate(tomorrow));
    setLoading(false);
  }, []);

  const fetchCartdetails = async () => {
    setBooking(true)
    try {
         await new Promise((resolve) => setTimeout(resolve,2000))
      const res = await BookingRoom(id, { checkIn, checkOut });
      console.log(res.data);

   

      // ✅ Success toast
      toast.success('Room booked successfully for 1 day!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
     if (res.data.success) {
  navigate(`/bookings`);
}


    } catch (error) {
      console.log(error);

      // ❌ Error toast
      toast.error(error.response?.data?.message || 'Failed to add room to cart.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  if (loading) return <p>Preparing booking...</p>;

  return (
    <>
    <Navbar/>
    <div className="cart-container">
      <h1>Booking Summary</h1>
      <p>
        <strong>Check-In:</strong> {checkIn} <br />
        <strong>Check-Out:</strong> {checkOut}
      </p>
    <button onClick={fetchCartdetails} disabled={booking}>
      {
        booking ? "Booking..." : "Book From 1 Day"  
      }
    </button>
      {/* <button>Book Room for 1 Day</button> */}
    </div>
    </>
  );
}

export default Cart;
