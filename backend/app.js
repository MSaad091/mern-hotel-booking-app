import express from 'express'
import cookieParser from 'cookie-parser';
import path from 'path';
import UserRouter from './routes/User.route.js'
import AdminRouter from './routes/Admin.route.js'
import cors from 'cors'
const app = express();


// app.use(cors({
//   origin: [
//     "https://mern-hotel-booking-app-64io.vercel.app", //admin-panel
//     "https://mern-hotel-booking-app-rpao.vercel.app"  //user-panel
//   ],
//   credentials: true
// }));
const allowedOrigins = [
  "https://mern-hotel-booking-app-64io.vercel.app", // admin
  "https://mern-hotel-booking-app-rpao.vercel.app"  // user
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // Postman / server requests
    if(allowedOrigins.includes(origin)){
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json())
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(cookieParser())

app.use('/public',express.static(path.join(process.cwd(),'public')))



app.use('/user',UserRouter)

app.use('/admin',AdminRouter)




export {app} 