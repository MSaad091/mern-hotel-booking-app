import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './Components/Register'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './Components/Login';
import Home from './Components/Home';
import AllRoom from './Components/AllRoom';
import Detail from './Components/Detail';
import Cart from './Components/Cart';
import Review from './Components/Review';
import Profile from './Components/Profile';
import UpdateProfile from './Components/UpdateProfile';
import Booking from './Components/Booking';
import ProtectedRoute from './Components/ProtectedRoute';

// import ViewRoom from './Components/ViewRoom'
function App() {
  return (
  <>
  <Routes>
    <Route path='/' element={<Register/>} />
    <Route path='/login' element={<Login/>}/>
    <Route path='/home' element={
      <Home/>
    } />
    <Route path='/room' element={<AllRoom/>}/>
    <Route path='/room/:id' element={<Detail/>} />
    <Route path='/bookings/:id' element={<Cart/>} />
    <Route path='/add-comment/:id' element={<Review/>} />
    <Route  path='/profile' element={<Profile/>} />
    <Route path='/update-profile' element={<UpdateProfile/>} />
    <Route path='/bookings' element={<Booking/>} />
  </Routes>
   <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
      />
  </>
  )
}

export default App