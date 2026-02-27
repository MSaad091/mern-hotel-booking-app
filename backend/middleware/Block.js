import { User } from "../models/User.model.js";

const checkBlocked = async (req,res,next) => {
  try {
    const user = await User.findById(req.user._id);
     if (!user) {
      return res.status(404).json({
        success:false,
        message:"User Not Found"
      })
     }

     if (user.blocked) {
    return res.status(403).json({ success: false, message: "You are blocked. Contact admin." });
  }
  next();
  } catch (error) {
    console.log(error);
    
  }
}
export {checkBlocked}