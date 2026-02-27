import React, { useState, useEffect } from "react";
import "../stylesheets/Navbar.css";
import { logout } from "../../api";
import { useNavigate, Link, useLocation } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false); // default false
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Check login status on mount & route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, [location.pathname]);

  const userLogout = async () => {
    try {
      const request = await logout();
      const response = request.data;
      if (response.success) {
        localStorage.removeItem("token");
        setLoggedIn(false);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar on route change
  useEffect(() => setOpen(false), [location.pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [open]);

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <>
      <nav className={`nav-links ${scrolled ? "scrolled" : ""}`}>
        <h1 onClick={() => navigate("/home")}>🏨 Hotel Booking</h1>

        <ul>
          <li><Link to="/home" className={isActive("/home")}>🏠 Home</Link></li>
          <li><Link to="/room" className={isActive("/room")}>📦 Inventory</Link></li>
          <li><Link to="/bookings" className={isActive("/bookings")}>📅 Bookings</Link></li>
          <li><Link to="/profile" className={isActive("/profile")}>👤 Profile</Link></li>

          {/* Conditional Buttons */}
          {isLoggedIn ? (
            <button onClick={userLogout}>🚪 Logout</button>
          ) : (
            <>
              <Link to="/login"><button>Login</button></Link>
              <Link to="/register"><button>Register</button></Link>
            </>
          )}
        </ul>

        <div className="hamburger" onClick={() => setOpen(true)}>☰</div>
      </nav>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <div className={`sidebar ${open ? "active" : ""}`}>
        <span className="close" onClick={() => setOpen(false)}>&times;</span>
        <h2>🏨 Hotel Booking</h2>
        <ul>
          <li><Link to="/home" onClick={() => setOpen(false)} className={isActive("/home")}>🏠 Home</Link></li>
          <li><Link to="/room" onClick={() => setOpen(false)} className={isActive("/room")}>📦 Inventory</Link></li>
          <li><Link to="/bookings" onClick={() => setOpen(false)} className={isActive("/bookings")}>📅 Bookings</Link></li>
          <li><Link to="/profile" onClick={() => setOpen(false)} className={isActive("/profile")}>👤 Profile</Link></li>

          {isLoggedIn ? (
            <button onClick={userLogout}>🚪 Logout</button>
          ) : (
            <>
              <Link to="/login"><button onClick={() => setOpen(false)}>Login</button></Link>
              <Link to="/register"><button onClick={() => setOpen(false)}>Register</button></Link>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default Navbar;
