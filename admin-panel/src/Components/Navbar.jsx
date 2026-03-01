import React, { useState, useEffect } from "react";
import "../stylesheets/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { ADminLogout } from "../../api";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async() => {
    const res = await ADminLogout();
    console.log(res.data);
    
  }

  // Close sidebar when route changes
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="nav-links">
        <h1>Admin Dashboard</h1>

        {/* Desktop Menu */}
        <ul className="menu">
          <li>
            <Link 
              to='/all-user' 
              className={isActive('/all-user') ? 'active' : ''}
            >
              Users
            </Link>
          </li>
          <li>
            <Link 
              to='/all-rooms' 
              className={isActive('/all-rooms') ? 'active' : ''}
            >
              Rooms
            </Link>
          </li>
          <li>
            <Link 
              to='/bookings' 
              className={isActive('/bookings') ? 'active' : ''}
            >
              Bookings
            </Link>
          </li>
          <li>
            <Link 
              to='/create-hotel' 
              className={isActive('/create-hotel') ? 'active' : ''}
            >
              Create Hotel
            </Link>
          </li>
          <li>
            <Link 
              to='/hotel' 
              className={isActive('/hotel') ? 'active' : ''}
            >
              Hotels
            </Link>
          </li>
          {/* <li>
            <Link 
              to='/create-room' 
              className={isActive('/create-room') ? 'active' : ''}
            >
              Create Room
            </Link>
          </li> */}
        </ul>

        {/* Hamburger Menu Button */}
        <button 
          className="side" 
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {/* Overlay */}
      {open && (
        <div 
          className="overlay" 
          onClick={() => setOpen(false)}
          role="button"
          aria-label="Close menu"
          tabIndex={0}
        />
      )}

      {/* Mobile Sidebar */}
      <ul className={`sidebar ${open ? "active" : ""}`}>
        <button onClick={() => setOpen(false)}>Close</button>
        <li>
          <Link to='/all-user' onClick={() => setOpen(false)}>Users</Link>
        </li>
        <li>
          <Link to='/all-rooms' onClick={() => setOpen(false)}>Rooms</Link>
        </li>
        <li>
          <Link to='/bookings' onClick={() => setOpen(false)}>Bookings</Link>
        </li>
        <li>
          <Link to='/create-hotel' onClick={() => setOpen(false)}>Create Hotel</Link>
        </li>
        <li>
          <Link to='/hotel' onClick={() => setOpen(false)}>Hotels</Link>
        </li>
        {/* <li>
          <Link to='/create-room' onClick={() => setOpen(false)}>Create Room</Link>
        </li> */}
        <li>
          <Link to='/register' onClick={() => setOpen(false)}>Register</Link>
        </li>
        <li>
          <Link to='/login' onClick={() => setOpen(false)}>Login</Link>
        </li>
        <li>
          <Link  onClick={handleLogout}>Logout</Link>
        </li>
      </ul>
    </>
  );
}

export default Navbar;