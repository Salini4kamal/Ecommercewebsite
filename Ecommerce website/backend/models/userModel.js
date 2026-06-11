
import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:[true,"please enter your name"],
    maxLength:[25,"Invalid name name must be fewer than 25 char"],
    minLength:[3,"Name should contain more than 3 char"]
},
email:{
    type:String,
    required:[true,"please enter your email"],
    unique:true,
    validate:[validator.isEmail,"please enter valid email"]
},
password:{
    type:String,
    required:[true,"please enter your password"],
    minLength:[8,"Password should greater than 8 charecters"],
    select:false,
},
avatar:{
    public_id:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    },

},
role:{
    type:String,
    default:'user',
},
resetPasswordToken:String,
resetPasswordExpire:Date,
},
{timestamps:true}
);
userSchema.pre("save",async function (){
    if(!this.isModified("password")){
        return 
    }
    this.password=await bcryptjs.hash(this.password,10)
})
userSchema.methods.getJwtToken=function (){
     return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,})
}
userSchema.methods.verifyPassword= async function (userPassword){
    return await bcryptjs.compare(userPassword,this.password)
}

userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now() + 30 * 60 * 1000;
    return resetToken;
}

export default mongoose.model("User",userSchema);