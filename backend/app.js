import express from 'express'
import cookieParser from 'cookie-parser';
import path from 'path';
import UserRouter from './routes/User.route.js'
import AdminRouter from './routes/Admin.route.js'
import cors from 'cors'
const app = express();


app.use(cors({
      origin:"http://localhost:5173",
    credentials: true
}))


app.use(express.json())
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(cookieParser())

app.use('/public',express.static(path.join(process.cwd(),'public')))



app.use('/user',UserRouter)

app.use('/admin',AdminRouter)




export {app} 