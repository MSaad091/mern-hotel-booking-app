// import dotenv from 'dotenv'

// dotenv.config({ path: "./.env" });
// import fs from 'fs';
// import { v2 as cloudinary } from 'cloudinary';

// // Cloudinary configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET_KEY
// });

// // 🔍 Check if config is loaded
// console.log("Cloudinary Config:", {
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY ? "Loaded" : "Not Loaded",
//     api_secret: process.env.API_SECRET_KEY ? "Loaded" : "Not Loaded"
// });
 
// const UploadCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null; // ✅ fix: return null only if file path missing

//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         });

//         console.log("File Uploaded Successfully:", response.secure_url);

//         // Remove local file after upload
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }

//         return response;
//     } catch (error) {
//         console.log("Cloudinary Upload Error:", error);
//         if (fs.existsSync(localFilePath)) {
//             fs.unlinkSync(localFilePath);
//         }
//         return null;
//     }
// };

// export { UploadCloudinary };


import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET_KEY
});

// Stream upload function (Render/Buffer ke liye yahi chalta hai)
const UploadCloudinary = cloudinary; 

export { UploadCloudinary };