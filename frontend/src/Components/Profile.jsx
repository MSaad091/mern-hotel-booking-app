import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getuser } from "../../api";
import "../stylesheets/Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Navigate to update profile page
  const handleRoute = () => {
    navigate("/update-profile");
  };

  // Fetch user from backend
  const fetchuser = async () => {
    try {
      const res = await getuser();
      setUser(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchuser();
  }, []);

  if (!user) {
    return (
      <>
        <Navbar />
        <p className="profile-loading">Loading Profile...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-wrapper">
        <div className="profile-card">
          {/* Header */}
          <div className="profile-header">
            <div className="avatar">{user.fullName?.charAt(0).toUpperCase()}</div>
            <h2>{user.fullName}</h2>
            <span className="role">{user.role}</span>
          </div>

          {/* Info Section */}
          <div className="profile-info">
            <div className="info-row">
              <span>Email</span>
              <p>{user.email}</p>
            </div>

            <div className="info-row">
              <span>Phone</span>
              <p>{user.phone}</p>
            </div>

            <div className="info-row">
              <span>Country</span>
              <p>{user.country}</p>
            </div>

            <div className="info-row">
              <span>City</span>
              <p>{user.city}</p>
            </div>

            <div className="info-row">
              <span>Status</span>
              <p className={user.isVerified ? "verified" : "not-verified"}>
                {user.isVerified ? "Verified" : "Not Verified"}
              </p>
            </div>

            {/* Update Profile Button */}
            <button className="update-btn" onClick={handleRoute}>
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
