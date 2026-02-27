import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DetailRoom, RoomDetails } from "../../api";
import "../stylesheets/Detail.css";
import Navbar from "./Navbar";

function Detail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const roomAvailibility = async() => {
    try {
      const request = await RoomDetails(id);
      setRoom(request.data.data)
      const response = request.data;
      console.log(response.data);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const fetchDetails = async () => {
    try {
      const res = await DetailRoom(id);
      setRoom(res.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleCart = (roomId) => {
    navigate(`/bookings/${roomId}`);
  };

  const handleComments = () => {
    navigate(`/add-comment/${id}`);
  };

  useEffect(() => {
    fetchDetails();
    roomAvailibility();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!room) return <p className="loading">Room not found</p>;

  return (
    <>
      <Navbar />

      {/* 🔥 FIXED WRAPPER */}
      <div className="detail-page">
        <div className="detail-container">
          <h1>{room.name}</h1>

          {/* Images */}
          <div className="room-images">
            {room.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${room.name}-${index}`}
                className="room-detail-img"
              />
            ))}
          </div>

          {/* Info */}
          <div className="detail-info">
            <p><strong>Type:</strong> {room.type}</p>
            <p><strong>Capacity:</strong> {room.capacity}</p>
            <p><strong>Price:</strong> ₹{room.price}</p>
            <p><strong>Amenities:</strong> {room.amenities.join(", ")}</p>
            <p>
              <strong>Status:</strong>{" "}
              {room.isAvailable ? "Available" : "Not Availible"}
            </p>
          </div>

          <p className="room-description">
            <strong>Description:</strong> {room.description}
          </p>

          {/* Buttons */}
          <div className="detail-actions">
            <button onClick={() => handleCart(room._id)}>Add To Cart</button>
            <button className="secondary" onClick={handleComments}>
              View Comments
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Detail;
