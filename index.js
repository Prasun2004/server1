import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoute from "./routes/userRoutes.js";
import courseRoute from "./routes/courseRoutes.js";
import mediaRoute from "./routes/mediaRoute.js";
import purchaseRoute from "./routes/purchaseRoute.js";
import courseProgressRoute from "./routes/courseProgressRoute.js";

dotenv.config({});

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:true,
    credentials:true
}));

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected");
    }catch(e){
        console.log(e);
    }
};

connectDB();

app.use("/user",userRoute);
app.use("/course",courseRoute);
app.use("/media",mediaRoute);
app.use('/purchase',purchaseRoute);
app.use("/progress",courseProgressRoute);

app.listen(process.env.PORT,()=>{
    console.log("server start ");
});

