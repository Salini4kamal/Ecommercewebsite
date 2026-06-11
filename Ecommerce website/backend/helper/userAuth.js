import HandleError from "./handleError.js";
import User from "../models/userModel.js"; 

import jwt from "jsonwebtoken"; 
export const verifyUser=async(req,res,next)=>{
    const {token}=req.cookies;
   // console.log(token);
    if(!token){
        return next(new HandleError("Access denied please login to access",401))
    }
    const decodedData=jwt.verify(token,process.env.JWT_SECRET_KEY);
    //console.log(decodedData);
    req.user=await User.findById(decodedData.id);
   // console.log(req.user)
    next();
};
//["admin","superAdmin"]
//["user"]
 export const roleBasedAccess = (...roles)=>{
return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new HandleError(`Role-${req.user.role} is not alloewed to access this resorce`,403))
    }
    next();
};
 };