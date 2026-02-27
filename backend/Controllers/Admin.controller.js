import { UploadCloudinary } from "../cloudinary.js";
import { Booking } from "../models/Booking.model.js";
import { Hotel } from "../models/Hotel.model.js";
import { Room } from "../models/Room.model.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";

 
 
 const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, phone, role, city, country, isVerified } = req.body;

    // Validation
    if([fullName,email,password,phone,city,country].some(el => !el || el.toString().trim()==="")){
      return res.status(400).json({success:false,message:"All fields are required"});
    }

    // Check existing user
    const existedUser = await User.findOne({ $or: [{email}, {fullName}] });
    if(existedUser) return res.status(409).json({success:false,message:"User already exists"});
   
 
    const userCreate = await User.create({
      fullName,
      email,
      password, // will be hashed by pre-save hook
      phone,
      role: "admin",
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


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 🔥 YAHI FIX HAI
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = user.generateAccessToken();

    const loggedInAdmin = await User.findById(user._id).select("-password");

    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true,
  secure: true,
  sameSite: "none" })
      .json({
        success: true,
        message: "Admin logged in successfully",
        data: loggedInAdmin,
        accessToken,
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const CreateHotel = async (req, res) => {
  try {
    const { name, city, address, description } = req.body;

    if (!name || !city || !address || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const hotel = await Hotel.create({
      name,
      city,
      address,
      description,
      createdBy: req.user._id, // ✅ VERY IMPORTANT
    });

    return res.status(201).json({
      success: true,
      message: "Hotel Created Successfully",
      data: hotel,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};










const CreateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price, capacity, description, amenities } = req.body;

    // 1️⃣ Basic validation
    if (!name || !type || !price || !capacity) {
      return res.status(400).json({
        success: false,
        message: "Name, type, price, and capacity are required",
      });
    }

    // 2️⃣ Check hotel exists
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel Not Found",
      });
    }

    // 3️⃣ Check images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Room images are required",
      });
    }

    // 4️⃣ Upload images to Cloudinary
    const imageUrls = [];

    for (const file of req.files) {
      const uploaded = await UploadCloudinary(file.path);
      imageUrls.push(uploaded.secure_url);
    }

    // 5️⃣ Create room
    const room = await Room.create({
      hotel: hotel._id,
      name,
      type,
      price: Number(price),
      capacity: Number(capacity),
      description,
      amenities,
      images: imageUrls,
    });

    // 6️⃣ Save room reference in hotel
    hotel.rooms.push(room._id);
    await hotel.save();
 
    return res.status(201).json({
      success: true,
      message: "Room Created Successfully",
      data: room,
    });

  } catch (error) {
    console.error("CreateRoom Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
  

const AllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Rooms Found"
      });
    }

    const today = new Date();

    const updatedRoom = await Promise.all(
      rooms.map(async (room) => {

        const booking = await Booking.findOne({
          room: room._id,
          checkIn: { $lte: today },
          checkOut: { $gt: today }
        });

        return {
          ...room._doc,
          isAvailable: booking ? false : true
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: updatedRoom
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


 
const DeleteRoom = async (req, res) => {
  try {
    const { id } = req.params; // Room ID
    const { hotelId } = req.body; // Optional: hotel verification

    // Find room first
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room Not Found",
      });
    }

    // Optional: check if the room belongs to the hotel
    if (hotelId && room.hotel.toString() !== hotelId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this room",
      });
    }

    // Delete the room
    await Room.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Room Deleted Successfully",
      data: room,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};




 const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price, capacity, description, amenities } = req.body;
    let imageUrls = req.body.images || []; // Make sure this is an array

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success:false, message:"Invalid Room ID" });
    }

    // Ensure amenities is array
    const amenitiesArray = typeof amenities === "string" ? amenities.split(",").map(a => a.trim()) : amenities;

    // Build update object
    const updateData = {
      name,
      type,
      price: Number(price),
      capacity: Number(capacity),
      description,
      amenities: amenitiesArray,
      ...(imageUrls.length > 0 && { images: imageUrls }),
    };

    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedRoom) {
      return res.status(404).json({ success:false, message:"Room not found" });
    }

    return res.status(200).json({ success:true, message:"Room updated successfully", data: updatedRoom });

  } catch (error) {
    console.error("Update Room Error:", error);
    return res.status(500).json({ success:false, message:"Server Error" });
  }
};

    // Update the room
//     const updatedRoom = await Room.findByIdAndUpdate(
//       id,
//       {
//         name,
//         type,
//         price: Number(price),
//         capacity: Number(capacity),
//         description,
//         amenities,
//         ...(imageUrls.length > 0 && { images: imageUrls }), // Only update images if uploaded
//       },
//       { new: true } // Return the updated document
//     );

//     if (!updatedRoom) {
//       return res.status(404).json({
//         success: false,
//         message: "Room not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Room updated successfully",
//       data: updatedRoom,
//     });
//   } catch (error) { 
//     console.error(error);
//     return res.status(500).json({
//       success: false, 
//       message: "Server Error",
//     });
//   }
// };


 const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price, capacity, description, amenities } = req.body;
    let imageUrls = req.body.images || []; // Make sure this is an array

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success:false, message:"Invalid Room ID" });
    }

    // Ensure amenities is array
    const amenitiesArray = typeof amenities === "string" ? amenities.split(",").map(a => a.trim()) : amenities;

    // Build update object
    const updateData = {
      name,
      type,
      price: Number(price),
      capacity: Number(capacity),
      description,
      amenities: amenitiesArray,
      ...(imageUrls.length > 0 && { images: imageUrls }),
    };

    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedRoom) {
      return res.status(404).json({ success:false, message:"Room not found" });
    }

    return res.status(200).json({ success:true, message:"Room updated successfully", data: updatedRoom });

  } catch (error) {
    console.error("Update Room Error:", error);
    return res.status(500).json({ success:false, message:"Server Error" });
  }
};

const AllBooking = async (req,res) => {
  try {
     const booked = await Booking.find();
     
     if (!booked) {
      return res.status(404).json({
        success:false,
        message:"Booking Not FOund"
      })
     }

     return res.status(200).json({
      success:true,
      message:"All Booking",
      data:booked
     })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Server Error"
    })
  }
}

const AllUser = async (req,res) => {
  try {
    const users = await User.find()
    if (!users) {
      return res.status(404).json({
        success:false,
        message:"Users Not Found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"All Users Here",
      data:users
    })
  } catch (error) {
    console.log(error);
      return res.status(500).json({
      success:false,
      message:"Server Error"
    })
  }
}

const AllHotel = async (req,res) => {
  try {
    const hotel = await Hotel.find();
    if (!hotel) {
      return res.status(404).json({
        success:false,
        message:"Hotel Not Found"
      })
    }


    return res.status(200).json({
      success:true,
      message:"All Hotels Fetched",
      data:hotel
    })
  } catch (error) {
    console.log(error);
      return res.status(500).json({
      success:false,
      message:"Server Error"
    })
  }
}

const BookingCount = async (req,res) => {

  try {
    const CountBooking = await Booking.find().countDocuments();

    if (!CountBooking) {
      return res.status(404).json({
        success:false,
        message:"COunt Booking Not Found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"Count Booking Fetched",
      data:CountBooking
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"Server Error"
    })  
  }

}

const LogoutAdmin = async (req,res) => {
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
return res.status(200).
clearCookie("accessToken",options).
json({
  success:true,
  message:"User Logout Successfully"
})

  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Server Error"
    })
  }
}
// const blockUser = async (req,res) => {
//   try {
//     const userId = req.params;
    
//     const user = await User.findByIdAndUpdate(
//       userId,
//       {blocked:true},
//       {new: true}
//     )

//     if (!user) {
//       return res.status(404).json({
//         success:false,
//         message:"user not found"
//       })
//     }
//     return res.status(200).json({
//       success:true,
//       message:"User Blocked",
//       data:user
//     })

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success:false,
//       message:"Server Error"
//     })
    
//   }
// }
const blockUser = async (req, res) => {
  try {
    // ✅ sirf userId extract karo
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,          // yahan string pass karo
      { blocked: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Blocked",
      data: user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
   
const unblockUser = async (req,res) => {   
  try {
    const {userId} = req.params;

    const user =  await User.findByIdAndUpdate(
      userId,
      {blocked:false},
      {new:true}
    )
     if (!user) {
      return res.status(404).json({
        success:false,
        message:"user not found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"Unblock",
      data:user
    })
    
  } catch (error) {
    console.log(error);
     return res.status(500).json({
      success:false,
      message:"Server Error"
    })
    
  }
}

const userDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("user", "fullName email")
      .populate("room", "name  price" )
      .populate("hotel", "name city address")
      

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking Not Found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched Details",
      data: booking
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

const getRoomDetails = async(req,res) => {
  try {
    const {id} = req.params;
    
    const room = await Room.findById(id)
    if (!room) {
      return res.status(404).json({
        success:false,
        message:"Room NotFound"
      })
    }

    return res.status(200).json({
      success:true,
      message:"Room Fetched SuccessFully",
      data:room
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Server Error"
    })
  }
}

export {getRoomDetails,userDetails,AllRooms,registerAdmin,loginAdmin,CreateRoom,CreateHotel,DeleteRoom,UpdateRoom,AllBooking,AllUser,BookingCount,AllHotel,LogoutAdmin,blockUser,unblockUser} 