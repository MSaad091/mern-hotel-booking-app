import axios from "axios";



// const api = axios.create({
//     baseURL:'https://mern-hotel-booking-app-1-lama.onrender.com/user',
//     withCredentials:true
// })

const api = axios.create({
    baseURL:'https://mern-hotel-booking-app-1-lama.onrender.com/user',
    withCredentials:true
});


export const RegisterUser = (data) => api.post('/register', data)

export const LoginUser = (data) => api.post('/login',data)

export const Rooms = () => api.get('/allrooms')

export const DetailRoom = (id) => api.get(`/room/${id}`)

export const RoomDetails = (id) => api.get(`/rooms/${id}`)


// export const BookingRoom = (id) => api.get(`/bookings/${id}`);
export const BookingRoom = (id, data) => api.post(`/bookings/${id}`, data);

export const reviews = (id,data) => api.post(`/add-comment/${id}`,data)

export const getComments = (id) =>  api.get(`/comment/${id}`)

export const logout = () => api.post('/logout')

export const getuser = () => api.get('/profile')

export const UpdateProfiles = (data) => api.post('/update-profile',data)

export const cancelBooking = (id,data) => api.post(`/cancel-booking/${id}`,data)

export  const cancelbooking = (id) => api.delete(`/cancel-booking/${id}`)


export const allBooking = () => api.get(`/bookings`)
export const checkoutbooking = (id) => api.post(`/room-status/${id}`)
