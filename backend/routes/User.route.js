import { Router } from "express";
import { loginUser, registerUser, RoomBooked, userUpdateProfile,createComment, UserLogout, CancelBooking, allRoom, bookingid, getcomments, getUser, findbooking, CheckoutBooking, DetailRoom } from "../Controllers/User.controller.js";
import { verifyJwt } from "../middleware/Auth.js";
import { checkBlocked } from '../middleware/Block.js'

const router = Router();

router.post("/register", registerUser);
router.route('/login').post(loginUser)

router.post(
  "/bookings/:roomId",
  verifyJwt,
  checkBlocked,      // user must be logged in
  RoomBooked
);
router.route('/rooms/:id').get(DetailRoom)
router.route('/room-status/:id').post(verifyJwt,CheckoutBooking)
router.route('/room/:id').get(bookingid)
router.route('/allrooms').get(allRoom)
// router.route('/add-comment').post(verifyJwt,createComment)
router.route('/update-profile').post(verifyJwt,userUpdateProfile)
// POST /users/add-comment/:roomId
router.route('/add-comment/:roomId').post(verifyJwt, checkBlocked,createComment);
router.route('/logout').post(verifyJwt,UserLogout)
router.route('/cancel-booking/:id').delete(verifyJwt,CancelBooking)
router.get("/comment/:id", verifyJwt, getcomments);
router.route('/profile').get(verifyJwt,getUser)

router.route('/bookings').get(verifyJwt,findbooking)


export default router; // ✅ router instance export

