// import { ApiError } from "../utils/ApiError.js";
// import { asynchandler } from "../utils/asynchandler.js";
import Jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
import { response } from "express";
export const verifyJWT = async (req, _, next) => {
  try {
    const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log("level 1");
    console.log("refreshtoken" + JSON.stringify(token));
    if (!token) {
      return response.status(401).json({error:"Unathorized Request"})
      
    }
    console.log("process.env.ACCESS_TOKEN_SECRET",process.env.ACCESS_TOKEN_SECRET)
    console.log("2");
    const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("3");
    console.log("decodedToken" + JSON.stringify(decodedToken));

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    console.log("4");
    if (!user) {
        return response.status(401).json({error:"Invalid Refresh Token"})
      
      console.log("5");
    }
    req.user = user;
    console.log("end");
    next();
  } catch (err) {
    return response.status(401).json({error:"Invalid Refresh Token 2"})
    
  }
};