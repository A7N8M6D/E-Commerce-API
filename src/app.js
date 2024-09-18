import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { limit } from "./constant.js";


const app= express();
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json({limit}))
app.use(express.urlencoded({extended:true , limit}))
//for images , pdf store
app.use(express.static("public"))
app.use(cookieParser())
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
app.use("/api/v1/users",userRouter)
app.use("/api/v1/products",productRouter)

export  {app}