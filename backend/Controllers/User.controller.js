import { Room } from "../models/Room.model.js";
import { User } from "../models/User.model.js";
import { Comment } from '../models/Comment.model.js'
import bcrypt from "bcrypt";
import  {sendEmail} from '../utils/sendEmail.js'
import { Booking } from "../models/Booking.model.js";


const generateaccessToken = async(userId) => {
   try {
     const user = await User.findById(userId)

     if (!user) {
        return res.status(404).json({
            success:false,
            message:"User Not Found"
        })
     } 


     const accessToken = await user.generateAccessToken();
     return {accessToken}


   } catch (error) {
    return res.status(500).json({
        success:false,
        message:"Server Error"
    })
   }



}
// Register User 
 const registerUser = async (req, res) => { 
  try {
    const { fullName, email, password, phone, role, city, country, isVerified } = req.body;

    // Validation
    if([fullName,email,password,phone,city,country].some(el => !el || el.toString().trim()==="")){
      return res.status(400).json({success:false,message:"All fields are required"});
    }

    // Check existing user
    const existedUser = await User.findOne({ $or: [{email}, {fullName}] });
    if(existedUser) return res.status(409).json({success:false,message:"User already exists"});

    // Create user
    const userCreate = await User.create({
      fullName,
      email,
      password, // will be hashed by pre-save hook
      phone,
      role: role || "user",
      city,
      country,
      isVerified: isVerified || false
    });

    res.status(201).json({
      success:true,
      message:"User created successfully",
      data: {
        _id:userCreate._id,
        fullName:userCreate.fullName,
        email:userCreate.email,
        phone:userCreate.phone,
        role:userCreate.role,
        city:userCreate.city,
        country:userCreate.country,
        isVerified:userCreate.isVerified
      }
    });

  } catch(error){
    console.error(error);
    res.status(500).json({success:false,message:"Server error"});
  }
};




const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required", 
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check password (call method from user instance)
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
 
    // Generate JWT token
    const accessToken = user.generateAccessToken();

    // Get user data without password
    const LoggedInUser = await User.findById(user._id).select("-password");

    // Cookie options
    const options = {
      httpOnly: true,
      secure: false, // change to true if using HTTPS
    };

    // Send response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({
        success: true,
        message: "User logged in successfully",
        data: LoggedInUser,
        accessToken,
      });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const userUpdateProfile = async (req, res) => {
  try {
    const { fullName, phone, city, country } = req.body; 

    if (!fullName) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country is required",
      });
    }
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }
    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, phone, city, country },
      { new: true, runValidators: true } // ensures schema validation
    ).select("-password"); // exclude password

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// const RoomBooked = async(req,res) => {

//   try {
//       const userId = req.user._id;
//     const { roomId } = req.params;
//     const { checkIn, checkOut } = req.body;

//     if (!roomId || !checkIn || !checkOut) {
//       return res.status(400).json({
//         success: false,
//         message: "RoomId, checkIn and checkOut are required",
//       });
//     }
//     const room = await Room.findById(roomId).populate("hotel")

//        if (!room) {
//       return res.status(404).json({
//         success: false,
//         message: "Room not found",
//       });
//     }
//       if (!room.isAvailable) {
//       return res.status(400).json({
//         success: false,
//         message: "Room is already booked",
//       });
//     }
//     const days =  (new Date(checkOut) - new Date(checkIn))/ (1000 * 60 * 60 * 24);
//            if (days <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid booking dates",
//       });
//     }
//     const totalPrice = days * room.price

//     const booking = await Booking.create({
//       user:userId,
//       hotel:room.hotel._id,
//       room:room.id,
// checkIn,
// checkOut,
// totalPrice,
// paymentStatus: "Paid"
//     })
//     room.isAvailable = false
//     await room.save();

//     await sendEmail({
//       to: req.user.email,
//       subject: "Room Booking Confirmed ✅",
//       html: `
//         <h2>Booking Confirmed</h2>
//         <p>Hello ${req.user.name},</p>
//         <p>Your booking details:</p>
//         <ul>
//           <li><b>Hotel:</b> ${room.hotel.name}</li>
//           <li><b>Room:</b> ${room.name}</li>
//           <li><b>Check-in:</b> ${checkIn}</li>
//           <li><b>Check-out:</b> ${checkOut}</li>
//           <li><b>Total:</b> $${totalPrice}</li>
//         </ul>
//       `,
//     });
//       return res.status(201).json({
//       success: true,
//       message: "Room booked successfully",
//       data: booking,
//     });

//   } catch (error) {
//      console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }

// } 
//  const RoomBooked = async (req, res) => {  
//   try {
//     const userId = req.user._id; // middleware se user attach hua hona chahiye
//     const { roomId } = req.params;
//     const { checkIn, checkOut } = req.body;

//     if (!roomId || !checkIn || !checkOut) {
//       return res.status(400).json({
//         success: false,
//         message: "RoomId, checkIn and checkOut are required",
//       });
//     }
 
//     const room = await Room.findById(roomId).populate("hotel");

//     if (!room) {
//       return res.status(404).json({
//         success: false,
//         message: "Room not found",
//       });
//     } 

//     if (!room.isAvailable) {
//       return res.status(400).json({
//         success: false,
//         message: "Room is already booked",
//       });
//     }

//     const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
//     if (days <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid booking dates",
//       }); 
//     }

//     const totalPrice = days * room.price;

//     const booking = await Booking.create({
//       user: userId,
//       hotel: room.hotel._id,
//       room: room._id,
//       checkIn,
//       checkOut,
//       totalPrice,
//       paymentStatus: "Paid",
//     });

//     room.isAvailable = false;
//     await room.save();
 
//     // Email send
//     if (req.user.email && req.user.name) {
//       await sendEmail({
//         to: req.user.email,
//         subject: "Room Booking Confirmed ✅",
//         html: `
//           <h2>Booking Confirmed</h2>
//           <p>Hello ${req.user.name},</p>
//           <p>Your booking details:</p>
//           <ul>
//             <li><b>Hotel:</b> ${room.hotel.name}</li>
//             <li><b>Room:</b> ${room.name}</li>
//             <li><b>Check-in:</b> ${checkIn}</li>
//             <li><b>Check-out:</b> ${checkOut}</li>
//             <li><b>Total:</b> $${totalPrice}</li>
//           </ul>
//         `,
//       });
//     } else {
//       console.log("User email or name not found, email not sent");
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Room booked successfully",
//       data: booking,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };
const RoomBooked = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roomId } = req.params;
    const { checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "RoomId, checkIn and checkOut are required",
      });
    }

    const room = await Room.findById(roomId).populate("hotel");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // 🔥 DATE VALIDATION
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in",
      });
    }

    // 🔥 OVERLAPPING BOOKING CHECK
    const overlappingBooking = await Booking.findOne({
      room: roomId,
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        message: "Room already booked for selected dates",
      });
    }

    // 💰 PRICE CALCULATION
    const days =
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    const totalPrice = days * room.price;

    // 🧾 CREATE BOOKING
    const booking = await Booking.create({
      user: userId,
      hotel: room.hotel._id,
      room: room._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      paymentStatus: "Paid",
    });

    // 📧 EMAIL
    if (req.user.email && req.user.name) {
      await sendEmail({
        to: req.user.email,
        subject: "Room Booking Confirmed ✅",
        html: `
          <h2>Booking Confirmed</h2>
          <p>Hello ${req.user.name},</p>
          <ul>
            <li><b>Hotel:</b> ${room.hotel.name}</li>
            <li><b>Room:</b> ${room.name}</li>
            <li><b>Check-in:</b> ${checkInDate.toDateString()}</li>
            <li><b>Check-out:</b> ${checkOutDate.toDateString()}</li>
            <li><b>Total:</b> $${totalPrice}</li>
          </ul>
        `,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Room booked successfully",
      data: booking,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const DetailRoom = async(req,res) => {
  try {
    const {id} = req.params;

    const room = await Room.findById(id)

    if (!room) {
      return res.status(404).json({
        success:false,
        message:"Room Not Found"
      })
    }

     const today = new Date()
    const activebooking = await Booking.findOne({
      room:id,
       checkOut: {$gte:today}
    })

    const isAvailable = !activebooking
    return res.status(200).json({
      success:true,
      data:{
        ...room._doc,
        isAvailable
      }
    })

   

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Server Error"
    })
  }
}

const CheckoutBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    // ✅ FIX #1: correct null check
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const today = new Date();
    const checkOutDate = new Date(booking.checkOut);

    // ✅ FIX #2: checkout time validation
    if (today < checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out time not reached yet",
      });
    }

    // ✅ FIX #3: correct status
    booking.status = "Completed";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Checked out successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
 

//old
// const RoomBooked = async (req, res) => {  
//   try {
//     const userId = req.user._id; 
//     const { roomId } = req.params;
//     const { checkIn, checkOut } = req.body;

//     if (!roomId || !checkIn || !checkOut) {
//       return res.status(400).json({
//         success: false,
//         message: "RoomId, checkIn and checkOut are required",
//       });
//     }

//     const room = await Room.findById(roomId).populate("hotel");

//     if (!room) {
//       return res.status(404).json({
//         success: false,
//         message: "Room not found",
//       });
//     }

//     // ✅ Check if room is already booked for given dates
//     const alreadyBooked = await Booking.findOne({
//       room: roomId,
//       checkOut: { $gt: new Date(checkIn) }, // checkOut > requested checkIn
//       checkIn: { $lt: new Date(checkOut) }, // checkIn < requested checkOut
//       status: "Booked"
//     });

//     if (alreadyBooked) {
//       return res.status(400).json({
//         success: false,
//         message: "Room is already booked for these dates",
//       });
//     }

    
    
//     const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
//     if (days <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid booking dates",
//       });
//     }

//     const totalPrice = days * room.price;

//     const booking = await Booking.create({
//       user: userId,
//       hotel: room.hotel._id,
//       room: room._id,
//       checkIn,
//       checkOut,
//       totalPrice,
//       // paymentStatus: "Paid",
//       paymentStatus: "Pending",
//       status: "Booked"
//     });

//     // ✅ Optional: remove isAvailable flag logic
//     // room.isAvailable = false;
//     // await room.save();

//     // Email send
//     if (req.user.email && req.user.name) {
//       await sendEmail({
//         to: req.user.email,
//         subject: "Room Booking Confirmed ✅",
//         html: `
//           <h2>Booking Confirmed</h2>
//           <p>Hello ${req.user.name},</p>
//           <p>Your booking details:</p>
//           <ul>
//             <li><b>Hotel:</b> ${room.hotel.name}</li>
//             <li><b>Room:</b> ${room.name}</li>
//             <li><b>Check-in:</b> ${checkIn}</li>
//             <li><b>Check-out:</b> ${checkOut}</li>
//             <li><b>Total:</b> $${totalPrice}</li>
//           </ul>
//         `,
//       });
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Room booked successfully",
//       data: booking,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };
 



 const createComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roomId } = req.params;
    const { rating, comment } = req.body;

    // Check if user has booked the room
    const booking = await Booking.findOne({
      user: userId,
      room: roomId,
     status: "Active" 
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message: "You can only comment on rooms you have booked.",
      });
    }

    const newcomment = await Comment.create({
      user: userId,
      room: roomId,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Comment Added Successfully",
      data: newcomment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
const UserLogout = async (req,res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,{
        $set:{
          accessToken:undefined
        }
      }
    )

    const options = {
      httpOnly:true,
      secure:false
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .json({
      success:true,
      message:"User Logout SuccessFully"
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Server Error"
    })
    
  }
}
// const CancelBooking = async (req,res) => {
//   try {

//     const {id} = req.params;
//     const booking = await Booking.findById(id)
//      if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     const Room = await Room.findByIdAndUpdate(
//       booking.room,{
//         isAvailable:true
//       }
//     )
//     await booking.deleteOne();
//     return res.status(200).json({
//       success:false,
//       message:"Cancel Booking",
//       data:Room
//     })


//   } catch (error) {
//     console.log(error);
    
//   }
// }
const CancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      booking.room,
      { isAvailable: true },
      { new: true } // updated document return kare
    );

    await booking.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: updatedRoom
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}

const allRoom = async(req,res) => {
  try {
    const rooms = await Room.find().populate("hotel","name");
    console.log(rooms);
    if (!rooms) {
      return res.status(404).json({
        success:false,
        message:"Room Not Found"

      })
    }

    return res.status(200).json({
      success:true,
      message:"Room Feteched SUccessFully",
      data:rooms
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Server Error"
    })
    
  }
}

const bookingid = async(req,res) => {
  try {
    const {id} = req.params
    const rooms = await Room.findById(id)

    if (!rooms) {
       return res.status(404).json({
        success:false,
        message:"Room Not Found"
       })
    }
    return res.status(200).json({
      success:true,
      message:"Room fetched SuccessFully",
      data:rooms
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Server Error"
    })
  }
} 
const getcomments = async (req, res) => {
  try {
    const { id } = req.params; // roomId

    const comments = await Comment.find({ room: id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: comments,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );

    return res.status(200).json({
      success: true,
      message: "User Fetched",
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
}; 

const findbooking = async (req,res) => {
  try {


    const bookings = await Booking.find({user:req.user._id}).populate("hotel").populate("room")

    if (!bookings) {
       return res.status(404).json({
        success:false,
        message:"Booking Not Found"
       })
    }

    return res.status(200).json({
      success:true,
      message:"Booking Fetched SuccessFully",
      data:bookings

    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Server Error"
    })
    
  }
}

export {DetailRoom, CheckoutBooking,findbooking,getUser,getcomments,bookingid,registerUser,loginUser,userUpdateProfile,RoomBooked,createComment,UserLogout,CancelBooking,allRoom}

