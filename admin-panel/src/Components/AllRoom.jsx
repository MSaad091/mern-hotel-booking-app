import React, { useEffect, useState } from "react";
import { allRooms } from "../../api";
import "../stylesheets/AllRoom.css";
import { useNavigate } from "react-router-dom";

function AllRoom() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const hanldeupdateRoom = (id) => {
    navigate(`/update/room/${id}`);
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const request = await allRooms();
      const response = request.data;
      setRooms(response.data || []);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className="rooms-container">
      <div className="header">
        <h1>All Rooms</h1>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-number">{rooms.length}</span>
            <span className="stat-label">Total Rooms</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {rooms.filter((room) => room.isAvailable).length}
            </span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              Rs: {rooms
                .reduce((sum, room) => sum + (room.price || 0), 0)
                .toLocaleString()}
            </span>
            <span className="stat-label">Total Value</span>
          </div>
        </div>
      </div>

      <div className="rooms-grid">
        {rooms.length === 0 ? (
          <div className="no-rooms">
            <p>No rooms found</p>
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room._id} className="room-card">
              <div className="room-images">
                {room.images && room.images.length > 0 ? (
                  <div className="image-slider">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="main-image"
                    />
                    <div className="thumbnail-container">
                      {room.images.slice(0, 3).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${room.name}-${index}`}
                          className="thumbnail"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>

              <div className="room-content">
                <div className="room-header">
                  <h2>{room.name}</h2>
                  <span className={`room-type ${room.type?.toLowerCase() || 'default'}`}>
                    {room.type || 'Standard'}
                  </span>
                </div>

                <p className="room-description">
                  {room.description || "No description available"}
                </p>

                <div className="room-details">
                  <div className="detail-item">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value">
                      ₹{room.price?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Capacity:</span>
                    <span className="detail-value">
                      {room.capacity || 0} Persons
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span
                      className={`availability ${room.isAvailable ? "available" : "booked"}`}
                    >
                      {room.isAvailable ? "Available" : "Booked"}
                    </span>
                  </div>
                </div>

                <div className="amenities">
                  <h4>Amenities:</h4>
                  <div className="amenities-list">
                    {room.amenities && room.amenities.length > 0 ? (
                      room.amenities.map((amenity, index) => (
                        <span key={index} className="amenity-tag">
                          {amenity}
                        </span>
                      ))
                    ) : (
                      <span className="no-amenities">No amenities listed</span>
                    )}
                  </div>
                  <button className="update-room-btn" onClick={() => hanldeupdateRoom(room._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                      <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                    </svg>
                    Update Room
                  </button>
                </div>

                <div className="room-footer">
                  <div className="created-date">
                    Created: {room.createdAt ? new Date(room.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllRoom;