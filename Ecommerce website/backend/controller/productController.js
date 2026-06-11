 //create product
 import APIHelper from "../helper/APIHelper.js";
import Product from "../models/productModel.js";
import errorHandler from "../helper/handleError.js"
 export const addProducts=async(req,res)=>{
    //console. log(req.body);
    req.body.user=req.user.id;
    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product,
   });
 }
 //http://localhost:8000/api/v1/products?keyword=bsnxsx 
 export const getAllProducts=async(req,res,next)=>{
   
   // const products=await Product.find()
   const resultPerPage=20;
   const apiHelper=new APIHelper(Product.find(),req.query).search().filter();
   const filteredQuery=apiHelper.query.clone();
   const productCount=await filteredQuery.countDocuments();
   const totalPages=Math.ceil(productCount/resultPerPage);

   const page=Number(req.query.page) || 1 ;
if(page > totalPages){
    return next(new errorHandler("This pagedoesn't exist",404))
}

   console.log(apiHelper)
   apiHelper.pagination(resultPerPage);
   const products=await apiHelper.query;

console.log(req.query.keyword)
    res.status(200).json({
        success:true,
        products,
        productCount,
        resultPerPage,
        totalPages,
        currentPage:page,
    });
    
}

export const updateProduct= async(req,res,next)=>{
    const id =req.params.id;
    let product=await Product.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
    })
     if(!product){
        //return res.status(500).json({success:false,message:"Product not found"})
    return next(new errorHandler("Product not found",404))
    }
   return res.status(200).json({success:true,product})
}
 //delete product
export const deleteProduct=async(req,res,next)=>{
     const id=req.params.id;
     let product=await Product.findByIdAndDelete(id);
     if(!product){
       // return res.status(500).json({success:false,message:"Product successfully deleted"})
    return next(new errorHandler("Product not found",404)) ;
    }
     return res.status(200).json({success:true,product})
}
//get single product from id 
export const getSingleProduct=async(req,res,next)=>{
    console.log(req.params.id);
    const id=req.params.id;
    let product=await Product.findById(id);
    if(!product){
       // return res.status(500).json({success:false,message:"Product not found"})
    return next(new errorHandler("product not found",404));
    }
   return res.status(200).json({success:true,product})
}
//Add review0
export const createProductReview=async(req,res,next)=>{
     console.log("Headers:", req.headers["content-type"]);
    console.log("Body:", req.body);
const {rating,comment,productId}=req.body;
const review={
    user:req.user._id,
    name:req.user.name,
    avatar:req.user.avatar.url,
    ratings:Number(rating),
    comment:{type:String,required:true},
    createdAt:{
        type:Date,
        default:Date.now,
    },
};
const product=await Product.findById(productId);
if(!product){
    return next(new errorHandler("Product not found",404))
}

const reviewExist=product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString());
//update review    // (rev) => rev.user.toString() === req.user._id.toString()
if(reviewExist){
    product.reviews.forEach((rev)=>{
        if(rev.user.toString()==req.user.id){
            rev.ratings=rating;
            rev.comment=comment;
        }
    })
}
else{
    //Add //push review
    product.reviews.push(review);
}
//update review count
product.numOfReviews=product.reviews.length;
//update rating
let sum=0;
product.reviews.forEach((rev)=>{
    sum+=rev.rating; 
});

product.ratings=product.reviews.length>0?sum/product.reviews.length:0;
//save details
await product.save({validateBeforeSave: false});
res.status(200).json({
    success:true,
    message:"Review added successfully",
    product,
});
}
//view review
export const viewProductReviews=async(req,res,next)=>{
    const product=await Product.findById(req.query.id);
    if(!product){
        return next(new errorHandler("Product not found",404))
    }
    res.status(200).json({
        success:true,
        reviews:product.reviews
    });

}
//Admin view all products
export const getAllProductsByAdmin=async(req,res,next)=>{
    const products=await Product.find();
    res.status(200).json({
        success:true,
        products,
    });

}
//Delete review
export const adminDeleteReview=async(req,res,next)=>{
//Product ID:req.query.productId  |  review:req.query.id
    const product=await Product.findById(req.query.productId);
if(!product){
    return next(new errorHandler("Product not found",404))
}
    const review =product.reviews.filter((rev)=>rev._id.toString()!==req.query.id.toString());
//it filters req.query.id and send the remaining review

    let sum=0;
    review.forEach((review)=>{
        sum+=review.rating;
    });
    const rating=review.length>0?sum/review.length:0;
    const numOfReviews=review.length;
    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews: review,
            ratings: rating,
            numOfReviews: numOfReviews
        },
        {
            new: true,
            runValidators: true
        }
    );
    res.status(200).json({
        success:true,
        message:"Review deleted successfully",
    });
}

// db.products.find({
//     name:{
//         $regex:"Samsung",
//         $options:"i",
//     }
// }) 