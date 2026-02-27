import mongoose from "mongoose";

console.log("MONGO URI 👉", process.env.MONGODB_URI);

const connectDb = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export { connectDb };
