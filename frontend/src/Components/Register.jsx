import React, { useState } from "react";
import { toast } from "react-toastify";
import "../stylesheets/Register.css";
import { useNavigate, Link } from "react-router-dom";
import { RegisterUser } from "../../api";

function Register() {
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const navigate = useNavigate();

  const handleregister = async (e) => {
    e.preventDefault();

    if (!fullName) return toast.error("Fullname is required");
    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");
    if (!phone) return toast.error("Phone is required");
    if (!city) return toast.error("City is required");
    if (!country) return toast.error("Country is required");

    try {
      const response = await RegisterUser({
        fullName,
        email,
        password,
        phone,
        city,
        country,
      });

      toast.success("Register Successful 🎉");

      if (response.success) {
        navigate("/login");
      }

      setFullname("");
      setEmail("");
      setPassword("");
      setPhone("");
      setCity("");
      setCountry("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleregister}>
        <h2>Create Account</h2>
        <p>Book hotels easily & securely</p>

        <label>Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullname(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Phone No</label>
        <input
          type="number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <label>Country</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <button type="submit">Register</button>

        {/* Login Option */}
        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
