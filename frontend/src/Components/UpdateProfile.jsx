import React, { useState } from "react";
import { UpdateProfiles } from "../../api";
import { useNavigate } from "react-router-dom";
import "../stylesheets/UpdatedProfile.css";

function UpdateProfile() {
  const [fullName, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const navigate = useNavigate();

  const updateprofile = async (e) => {
    e.preventDefault();
    try {
      const res = await UpdateProfiles({
        fullName,
        phone,
        city,
        country,
      });

      if (res.data.success) {
        navigate("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="update-wrapper">
      <div className="update-card">
        <h1>Update Profile</h1>

        <form onSubmit={updateprofile}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullname(e.target.value)}
          />

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            type="number"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
