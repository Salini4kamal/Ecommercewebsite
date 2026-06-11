import mongoose from "mongoose";
 const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"]
    },
    description:{
        type:String,
        required:[true,"please enter product description"],
    },
     mrp:{
        type:Number,
        required:[true,"please enter product mrp"],
        maxLength:[7,"price cannot exceed 7 digit"],
    },
    price:{
        type:Number,
        required:[true,"please enter product price"],
        maxLength:[7,"price cannot exceed 7 digit"],
    },
    ratings:{
        type:Number,
        default:0,
    },
    image:[
        {
            public_id:{
                type:String,
                required:[true],
            },
            url:{type:String,required:[true]},
        }
    ],
    category:{
        type:String,
        required:[true,"please enter product category"],
    },
    stock:{
        type:Number,
        required:[true,"please enter product stock"],
        default:1,
    },
    numOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            user:{type:mongoose.Schema.ObjectId,ref:"User",required:true}, 
            avatar:{type:String},
            name:{type:String,required:true},
            rating:{type:Number,required:true},
            comment:{type:String,required:true},
                createdAt:{
                    type:Date,
                    default:Date.now,
                }
        },
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
 });
 export default mongoose.model("Product",productSchema);