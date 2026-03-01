import { Router } from "express";
import { loginAdmin, registerAdmin, CreateRoom, CreateHotel, DeleteRoom, UpdateRoom, AllUser, AllBooking, AllHotel, BookingCount, LogoutAdmin, blockUser, unblockUser, AllRooms, userDetails, getRoomDetails } from "../Controllers/Admin.controller.js";
import { verifyJwt } from "../middleware/Auth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { upload } from "../middleware/multer.js"; // 🔥 IMPORTANT

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.post(
  "/create-hotel",
  verifyJwt,
  isAdmin,
  CreateHotel
);

router.route('/logout').post(verifyJwt,adminLogout)
// Route: POST /admin/hotels/:hotelId/rooms
router.post(
  "/hotels/:id/rooms",
  verifyJwt,
// isAdmin
  upload.array("images", 3), // 🔥 EXACT SAME NAME
  CreateRoom
);
router.delete(
  "/rooms/:id", // Room ID in params
  verifyJwt,
  isAdmin,
  DeleteRoom
);

router.route('/all-user').get(verifyJwt,AllUser)
router.route('/all-booking').get(verifyJwt,AllBooking)
router.route('/all-hotel').get(verifyJwt,AllHotel)
router.route('/booking-count').get(verifyJwt,BookingCount)
router.route('/logout').post(verifyJwt,isAdmin,LogoutAdmin)

// router.route('/block-user/:userId').post(verifyJwt,blockUser)
router.route('/block-user/:userId').post(verifyJwt, blockUser)
router.route('/unblock-user/:userId').post(verifyJwt,isAdmin,unblockUser)

router.route(`/all-rooms`).get(verifyJwt,isAdmin,AllRooms)

router.route('/update/room/:id').put(verifyJwt,isAdmin,upload.array("images", 3),UpdateRoom)
router.route('/details-booking/:id').get(verifyJwt,isAdmin,userDetails)
router.route('/room-info/:id').get(verifyJwt,isAdmin,getRoomDetails)
export default router;
