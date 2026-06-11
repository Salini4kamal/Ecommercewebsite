import HandleError from "../helper/handleError.js";
import { sendToken } from "../helper/jwtToken.js";
import { sendEmail } from "../helper/sendEmail.js";
import User from "../models/userModel.js"
import crypto from "crypto";
//user register
export const registerUser=async(req,res,next)=>{
    console.log(req.body)
const {name,email,password}=req.body;
console.log("BEFORE SAVE")



if(!name){
    return next(new HandleError("name is empty",400))
}
if(!email){
    return next(new HandleError("email is empty",400))
}
if(!password){
    return next(new HandleError("password is empty",400))
}
const user=await User.create({
    name,
    email,
    password,
    avatar:{
        public_id:"temp_id",
        url:"temp_url",
    },
})
// const token=user.getJwtToken();
// res.status(201).json({
//     success:true,
//     user,
//     token,
// })
sendToken(user,201,res);
}

//user login
export const loginUser=async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return next(new HandleError("Email or password cannot be empty",400));
    }
    const user=await User.findOne({email}).select("+password");
     if (!user) {
        return next(new HandleError("Invalid email or password", 401));
    }
    const isValidPassword=await user.verifyPassword(password)
    if(!isValidPassword){
        return next(new HandleError("Invalid email or password",401));
    }
    // const token=user.getJwtToken();
    // res.json({success:true,user,token})
    sendToken(user,200,res);
}
//userlogout
export const logout=async (req,res,next)=>{
    const option={
        expires:new Date(Date.now()),
        httpOnly:true,
    };
    res.cookie("token",null,option);
    res.status(200).json({success:true,message:"Successfully logged out"})
};


//reset password
export const forgetPassword=async(req,res,next)=>{
const {email}=req.body;
console.log(email);
const user=await User.findOne({email});
if(!user){
    return next(new HandleError("User not found with this email",404))
}
let resetToken;
try{
resetToken=user.createPasswordResetToken();
await user.save({ validateBeforeSave: false });
console.log(resetToken)
}catch(error){
    console.log(error);
    return next(new HandleError("Error in creating reset token",500))
}
const resetPasswordUrl=`${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
//http://localhost:8000/password/reset/1234567890
const message=`Your password reset token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`

const messageHTML=`<p>Your password reset token is:- 
<a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
<p> nfnefne kndeknde jndje </p>
<p> nfnefne kndeknde jndje </p>
<p> nfnefne kndeknde jndje </p>
 \n\n If you have not requested this email then, please ignore it.</p>`

try{
    await sendEmail({
        email:user.email,
        subject:"Password Reset",
        message,htmlMessage:messageHTML,
    });
    res.status(200).json({
        success:true,
        message:`Email sent to ${user.email} successfully`,
    })
}catch(error){

    console.log(error);
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save({validateBeforeSave:false});
return next(new HandleError("Error in sending email",500))
}
};
//user reset password
export const resetPassword=async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
console.log(resetPasswordToken);
const user=await User.findOne({
resetPasswordToken,
resetPasswordExpire:{$gt:Date.now()},
}
);
if(!user){
    return next(new HandleError("Reset password token is invalid or has been expired",400))
}
const{password,confirmPassword}=req.body;
if(password !== confirmPassword){
    return next(new HandleError("Password does not match",400))
}
user.password=password;
user.resetPasswordToken=undefined;
user.resetPasswordExpire=undefined;
await user.save();
sendToken(user,200,res);
}

//user profile
export const profile=async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
}
//user update password
export const updatePassword=async(req,res,next)=>{
    const {oldPassword,newPassword,confirmPassword}=req.body;
    console.log(req.body);
    const user=await User.findById(req.user.id).select("+password");
    console.log(user);
    const isCorrect=await user.verifyPassword(oldPassword);
    if(!isCorrect){
        return next(new HandleError("Old password is incorrect",400));
console.log("Old password is incorrect")
    }
    if(newPassword !== confirmPassword){
        return next(new HandleError("Password does not match",400))
        console.log("Password does not match")
    }
    user.password=newPassword;
    await user.save();
    sendToken(user,200,res);
}
//user update profile
export const updateProfile=async(req,res,next)=>{
const {name,email}=req.body;
const updatedUserDetails={name,email};
const user=await User.findByIdAndUpdate(req.user.id,updatedUserDetails,
    {new:true,runValidators:true})
    res.status(200).json({
        success:true,
        message:"Profile updated successfully",
        user,
    });
};

//admin side controller
export const getUsers=async(req,res)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users,
    });
}

export const getSingleUser=async(req,res,next)=>{
const id=req.params.id;
const user=await User.findById(id);
if(!user){
    return next(new HandleError("User not found",404))
}
res.status(200).json({
    success:true,
    user,
});
}
export const updateUserRole=async(req,res,next)=>{
    const {role}=req.body;
    const id=req.params.id;
const updatedRole={role};
const user=await User.findByIdAndUpdate(id,updatedRole,{ new:true});
if(!user){
    return next(new HandleError("User not found",404))
}
res.status(200).json({
    success:true,
    user,
});
}
export const deleteUser=async(req,res,next)=>{
    const id=req.params.id;
    const user=await User.findByIdAndDelete(id);
    if(!user){
        return next(new HandleError("User not found",404))
    }
    res.status(200).json({
        success:true,
        message:"User deleted successfully",
    });
}
export const userReview=async(req,res,next)=>{
    const {rating,comment,productId}=req.body;
    console.log("check",req.body);
    const review={
        rating,
        comment,
        productId,
        user: req.user.id
    };
    const newReview=await Review.create(review);
    res.status(201).json({
        success:true,
        review:newReview,
    });
}