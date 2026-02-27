import React, { useEffect, useState } from "react";
import { Hotels } from "../../api";
import "../stylesheets/AllHotel.css";
import { useNavigate } from "react-router-dom";

function AllHotel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchHotels = async () => {
    try {
      const res = await Hotels();
      setData(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoute = (hotelId) => {
    navigate(`/hotels/${hotelId}/rooms`)
  }

  useEffect(() => {
    fetchHotels();
  }, []);

  if (loading) {
    return <p className="loading">Loading hotels...</p>;
  }

  return (
    <div className="hotel-container">
      <h1>All Hotels</h1>

      <div className="hotel-grid">
        {data.length === 0 ? (
          <p>No hotels found</p>
        ) : (
          data.map((hotel) => (
            <div className="hotel-card" key={hotel._id}>
              <h2>{hotel?.name}</h2>

              <p>
                <strong>City:</strong> {hotel?.city || "N/A"}
              </p>

              <p>
                <strong>Address:</strong> {hotel?.address || "N/A"}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {hotel?.description || "No description available"}
              </p>
              <button onClick={() => handleRoute(hotel._id)}>Create Room</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllHotel;
