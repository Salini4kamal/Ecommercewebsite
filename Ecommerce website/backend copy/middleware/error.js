import HandleError from "../helper/handleError.js";

export default (err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message  || "Internal server error";

    //duplicate key error
    if(err.code===11000){
       // console.log(Object.keys(err.keyValue))
       //err.keyValue shows that {"email":"salini@gmail.com"}
       //Object.keys(err.keyValue) it shows keys
        const message=`This ${Object.keys(err.keyValue)} is already register`;
        err=new HandleError(message,400)
    }
    res.status(err.statusCode).json({
        success:false,
        message:err.message || "Internal server error",
    })
}
