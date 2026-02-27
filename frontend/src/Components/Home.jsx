import React from "react";
import Navbar from "./Navbar";
import "../stylesheets/Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handlenavigate = () => {
    navigate("/room");
  };

  return (
    <>
      <Navbar />

      <div className="main">
        <div className="hero-content">
          <h1>Welcome to Our Hotel</h1>
          <p>Luxury rooms, affordable prices & best services</p>

          <div className="hero-buttons">
            <button className="primary" onClick={handlenavigate}>
              Book Now
            </button>
            <button className="secondary" onClick={handlenavigate}>
              View Rooms
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
