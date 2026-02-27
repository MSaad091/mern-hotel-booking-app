import React, { useEffect, useState } from "react";
import { BookingInfo } from "../../api";
import { useParams } from "react-router-dom";
import "../stylesheets/UserDetails.css";

function UserDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchdetails = async () => {
    try {
      const request = await BookingInfo(id);
      const response = request.data;

      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchdetails();
    }
  }, [id]);

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!data) return <p className="no-data-text">No Data Found</p>;

  return (
   <div className="user-details-container">
  <h2 className="user-details-title">User Booking Details</h2>
  <div className="details-grid">
    <div className="detail-item">
      <div className="detail-label">Booking ID</div>
      <div className="detail-value">{data._id}</div>
    </div>
    <div className="detail-item">
      <div className="detail-label">User Name</div>
      <div className="detail-value">{data.user?.fullName}</div>
    </div>
    <div className="detail-item">
      <div className="detail-label">User Email</div>
      <div className="detail-value">{data.user?.email}</div>
    </div>
    <div className="detail-item">
      <div className="detail-label">Hotel</div>
      <div className="detail-value">{data.hotel?.name}</div>
    </div>
    <div className="detail-item">
      <div className="detail-label">City</div>
      <div className="detail-value">{data.hotel?.city}</div>
    </div>
    <div className="detail-item">
      <div className="detail-label">Address</div>
      <div className="detail-value">{data.hotel?.address}</div>
    </div>
    <div className="detail-item">
      <div className="detail-label">Room Name</div>
      <div className="detail-value">{data.room?.name}</div>
    </div>
    <div className="detail-item">
      <div className="detail-label">Room Price</div>
      <div className="detail-value">Rs: {data.room?.price}</div>
    </div>
    <div className="detail-item">
      <div className="detail-label">Check In</div>
      <div className="detail-value">{new Date(data.checkIn).toLocaleDateString()}</div>
    </div>
    <div className="detail-item">
      <div className="detail-label">Check Out</div>
      <div className="detail-value">{new Date(data.checkOut).toLocaleDateString()}</div>
    </div>
    <div className="detail-item">
      <div className="detail-label">Status</div>
      <div className="detail-value">
        <span className={`status status-${data.status?.toLowerCase()}`}>{data.status}</span>
      </div>
    </div>
    <div className="detail-item">
      <div className="detail-label">Payment Status</div>
      <div className="detail-value">{data.paymentStatus}</div>
    </div>
    <div className="detail-item">
      <div className="detail-label">Total Price</div>
      <div className="detail-value">Rs: {data.totalPrice}</div>
    </div>
  </div>
</div>

  );
}

export default UserDetails;
