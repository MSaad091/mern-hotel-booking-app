// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { BookingRoom, getRoomDetails } from '../../api';
// import { toast } from 'react-toastify';
// import '../Stylesheets/Cart.css';
// import Navbar from './Navbar';

// function Cart() {
//   const { id } = useParams();
//   const [checkIn, setCheckIn] = useState('');
//   const [checkOut, setCheckOut] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [booking, setBooking] = useState(false);
//   const [roomDetails, setRoomDetails] = useState(null);
//   const [totalNights, setTotalNights] = useState(1);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const navigate = useNavigate();

//   const formatDate = (date) => date.toISOString().split('T')[0];

//   const calculateNights = (start, end) => {
//     const startDate = new Date(start);
//     const endDate = new Date(end);
//     const diffTime = Math.abs(endDate - startDate);
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   useEffect(() => {
//     const fetchRoomDetails = async () => {
//       try {
//         const response = await getRoomDetails(id);
//         if (response.data) {
//           setRoomDetails(response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching room details:', error);
//         toast.error('Failed to load room details');
//       }
//     };
    
//     if (id) fetchRoomDetails();
//   }, [id]);

//   useEffect(() => {
//     const today = new Date();
//     const tomorrow = new Date();
//     tomorrow.setDate(today.getDate() + 1);
    
//     setCheckIn(formatDate(today));
//     setCheckOut(formatDate(tomorrow));
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     if (checkIn && checkOut && roomDetails) {
//       const nights = calculateNights(checkIn, checkOut);
//       setTotalNights(nights);
//       setTotalPrice(nights * (roomDetails.price || 0));
//     }
//   }, [checkIn, checkOut, roomDetails]);

//   const handleCheckInChange = (e) => {
//     const newCheckIn = e.target.value;
//     setCheckIn(newCheckIn);
    
//     const minCheckOut = new Date(newCheckIn);
//     minCheckOut.setDate(minCheckOut.getDate() + 1);
//     const minCheckOutStr = formatDate(minCheckOut);
    
//     if (checkOut <= newCheckIn) {
//       setCheckOut(minCheckOutStr);
//     }
//   };

//   const handleCheckOutChange = (e) => {
//     const newCheckOut = e.target.value;
//     if (newCheckOut > checkIn) {
//       setCheckOut(newCheckOut);
//     } else {
//       toast.warning('Check-out date must be after check-in date');
//     }
//   };

//   const fetchCartdetails = async () => {
//     setBooking(true);
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 300));
//       const res = await BookingRoom(id, { checkIn, checkOut });
      
//       toast.success(`Room booked successfully for ${totalNights} night${totalNights > 1 ? 's' : ''}!`, {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "colored",
//       });
      
//       if (res.data.success) {
//         navigate(`/bookings`);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to book room.', {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "colored",
//       });
//     } finally {
//       setBooking(false);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Loading room details...</p>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="cart-container">
//         <div className="cart-card">
//           <h1>Booking Summary</h1>
          
//           {roomDetails && (
//             <div className="room-details">
//               <h3>{roomDetails.name || 'Luxury Room'}</h3>
//               <p>{roomDetails.description || 'Experience comfort and luxury during your stay.'}</p>
//               <div className="room-price">
//                 Price per night: <span>${roomDetails?.price || 0}</span>
//               </div>
//             </div>
//           )}
          
//           <div className="date-container">
//             <div className="date-group">
//               <label>CHECK-IN DATE</label>
//               <input
//                 type="date"
//                 value={checkIn}
//                 onChange={handleCheckInChange}
//                 min={formatDate(new Date())}
//               />
//             </div>
//             <div className="date-group">
//               <label>CHECK-OUT DATE</label>
//               <input
//                 type="date"
//                 value={checkOut}
//                 onChange={handleCheckOutChange}
//                 min={formatDate(new Date(new Date().setDate(new Date().getDate() + 1)))}
//               />
//             </div>
//           </div>
          
//           <div className="booking-summary">
//             <div className="summary-item">
//               <span className="summary-label">Nights:</span>
//               <span className="summary-value">{totalNights} night{totalNights > 1 ? 's' : ''}</span>
//             </div>
//             <div className="summary-item">
//               <span className="summary-label">Price per night:</span>
//               <span className="summary-value">${roomDetails?.price || 0}</span>
//             </div>
//             <div className="summary-item total-price">
//               <span className="summary-label">Total Amount:</span>
//               <span className="summary-value">${totalPrice}</span>
//             </div>
//           </div>
          
//           <button 
//             className="book-button" 
//             onClick={fetchCartdetails} 
//             disabled={booking}
//           >
//             {booking ? "Processing..." : `Book Now - $${totalPrice}`}
//           </button>
//         </div>
//       </div>
//     </>
//   );
//   // checking purpuse
// }

// export default Cart; 

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BookingRoom, getRoomDetails } from '../../api';
import { toast } from 'react-toastify';
import '../Stylesheets/Cart.css';
import Navbar from './Navbar';

function Cart() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const [totalNights, setTotalNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  // Date format
  const formatDate = (date) => date.toISOString().split('T')[0];

  // Nights calculation
  const calculateNights = (start, end) => {
    const diff = new Date(end) - new Date(start);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Default dates
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    setCheckIn(formatDate(today));
    setCheckOut(formatDate(tomorrow));
  }, []);

  // 🔥 Fetch room
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await getRoomDetails(id);

        console.log("FULL API RESPONSE:", response);       // DEBUG
        console.log("DATA:", response.data);               // DEBUG

        // 🔥 HANDLE ALL CASES
        let room =
          response.data?.room ||
          response.data?.data ||
          response.data;

        console.log("FINAL ROOM:", room); // DEBUG

        setRoomDetails(room);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load room');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRoomDetails();
  }, [id]);

  // Calculate price
  useEffect(() => {
    if (checkIn && checkOut && roomDetails) {
      const nights = calculateNights(checkIn, checkOut);
      setTotalNights(nights);

      const price = Number(roomDetails?.price || 0);

      console.log("PRICE:", price); // DEBUG

      setTotalPrice(nights * price);
    }
  }, [checkIn, checkOut, roomDetails]);

  // Check-in change
  const handleCheckInChange = (e) => {
    const value = e.target.value;
    setCheckIn(value);

    const nextDay = new Date(value);
    nextDay.setDate(nextDay.getDate() + 1);

    if (checkOut <= value) {
      setCheckOut(formatDate(nextDay));
    }
  };

  // Check-out change
  const handleCheckOutChange = (e) => {
    const value = e.target.value;

    if (value > checkIn) {
      setCheckOut(value);
    } else {
      toast.warning('Check-out must be after check-in');
    }
  };

  // Booking
  const fetchCartdetails = async () => {
    setBooking(true);

    try {
      const res = await BookingRoom(id, { checkIn, checkOut });

      toast.success(`Booked for ${totalNights} night(s)!`);

      if (res.data.success) {
        navigate('/bookings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  // Loading UI
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="cart-container">
        <div className="cart-card">
          <h1>Booking Summary</h1>

          {/* DEBUG UI */}
          <p style={{fontSize:"12px", color:"gray"}}>
            {JSON.stringify(roomDetails)}
          </p>

          {/* Room Info */}
          {roomDetails && (
            <div className="room-details">
              <h3>{roomDetails?.name || 'Room'}</h3>
              <p>{roomDetails?.description}</p>

              <div className="room-price">
                Price per night:
                <span>
                  Rs {roomDetails?.price ? roomDetails.price : "NOT FOUND"}
                </span>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="date-container">
            <input
              type="date"
              value={checkIn}
              onChange={handleCheckInChange}
            />

            <input
              type="date"
              value={checkOut}
              onChange={handleCheckOutChange}
            />
          </div>

          {/* Summary */}
          <div className="booking-summary">
            <p>Nights: {totalNights}</p>
            <p>Price: Rs {roomDetails?.price || 0}</p>
            <h3>Total: Rs {totalPrice}</h3>
          </div>

          <button onClick={fetchCartdetails} disabled={booking}>
            {booking ? "Processing..." : `Book Now - Rs ${totalPrice}`}
          </button>
        </div>
      </div>
    </>
  );
}

export default Cart;