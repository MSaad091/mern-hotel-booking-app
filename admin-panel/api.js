import axios from "axios";


const api = axios.create({
    baseURL:"http://localhost:4000/admin",
    withCredentials:true
})

export const registerUser = (data) => api.post('/register',data)

export const loginUser = (data) => api.post('/login',data) 

export const Createproduct = (data) => api.post('/create-hotel',data)

export const Createroom = (id,data) => api.post(`/hotels/${id}/rooms`,data) 


export const Hotels = () => api.get(`/all-hotel`)

export const allBooking = () =>  api.get(`/all-booking`)

export const allUsers = ()  => api.get(`/all-user`)

export const bookingCount = () => api.get(`/booking-count`)

export const blockuser = (id) => api.post(`/block-user/${id}`)

export const unblockuser = (id) => api.post(`/unblock-user/${id}`)

export const allRooms = () => api.get(`all-rooms`)

export const updateRoom = (id,data) => api.put(`/update/room/${id}`,data)

export const BookingInfo = (id) => api.get(`/details-booking/${id}`)
export const RoomInfo = (id) => api.get(`/room-info/${id}`)
