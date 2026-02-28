import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token Not FOund",
      });
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid access Token",
      });
    }
    req.user = {
      _id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role, // 🔥 Ye line must hai
    };

    next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// const verifyJwt = async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.headers.authorization?.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Token Not Found",
//       });
//     }

//     const decodedToken = jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET
//     );

//     const user = await User.findById(decodedToken._id);

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid access Token",
//       });
//     }

//     req.user = {
//       _id: user._id,
//       name: user.fullName,
//       email: user.email,
//       role: user.role,
//     };

//     next();
//   } catch (error) {
//     console.log("JWT Error:", error);
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized",
//     });
//   }
// };
export { verifyJwt };
