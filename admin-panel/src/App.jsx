import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Register from "./Components/Register";
import Login from "./Components/Login";
import CreateProduct from "./Components/CreateProduct";
import CrRoom from "./Components/CrRoom";
import AllHotel from "./Components/AllHotel";
import AllBooking from "./Components/AllBooking";
import AllUser from "./Components/AllUser";
import AllRoom from "./Components/AllRoom";
import UpdateRoom from "./Components/UpdateRoom";
import UserDetails from "./Components/UserDetails";

function App() {
  return (
    <>
      <Navbar />

      {/* Global Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
      />

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/create-hotel" element={<CreateProduct/>} />
        {/* <Route path="/create-room" element={<CrRoom/>} /> */}
<Route path="/hotels/:id/rooms" element={<CrRoom />} />
 
        <Route path="/hotel" element={<AllHotel/>} />
        <Route path="/bookings" element={<AllBooking/>} />
        <Route path="/all-user" element={<AllUser/>}/>
        <Route path="/all-rooms" element={<AllRoom/>}/>
        <Route path="/update/room/:id" element={<UpdateRoom/>} />
        <Route path="/details/:id" element={<UserDetails/>} />

      </Routes>
    </>
  );
}

export default App;
