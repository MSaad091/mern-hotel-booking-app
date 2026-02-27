import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // 👈 security
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    blocked: {
  type: Boolean,
  default: false
},
    city: String,
    country: String,
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);






userSchema.pre("save",async function(next){
 if (!this.isModified("password")) return next();

 this.password = await bcrypt.hash(this.password,10)
})


userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};





userSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is missing");
  }

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};



export const User = mongoose.model("User", userSchema);
