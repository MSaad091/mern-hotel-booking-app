import dotenv from 'dotenv'
dotenv.config();

import { connectDb } from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 4000
app.get("/api/test", (req,res)=>{
  res.json({success:true,message:"Server is working"});
});

connectDb()
 .then(() => {
    app.listen(PORT,() => {
          console.log(`Server running on port ${PORT}`);
    })
 })
 .catch(err => {
     console.log("❌ MongoDB Connection failed:", err.message);
 }) 