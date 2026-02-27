import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

   hotel : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled", "Booked"],
      default: "Active",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Paid",
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model("Booking", bookingSchema);
