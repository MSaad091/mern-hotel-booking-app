import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel", // Hotel collection ko reference kar raha hai
    required: true,
  },
  name: {
    type: String,
    required: true, // Room ka name, jaise "Deluxe Room"
  },
  type: {
  type: String,
  enum: ["Single", "Double", "Suite", "Family", "Deluxe"],
  required: true,
}
,
  price: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number, // Kitne log is room me stay kar sakte hain
    required: true,
  },
  description: {
    type: String,
  },
  images: [
    {
      type: String, // Cloudinary ya local URL
    }
  ],
  isAvailable: {
    type: Boolean,
    default: true, // Available ya booked
  },
  amenities: [
    {
      type: String, // Jaise "WiFi", "AC", "TV"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const Room = mongoose.model("Room", roomSchema);
 