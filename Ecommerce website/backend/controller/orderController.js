import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import errorHandler from "../helper/handleError.js"
export const createNewOrder=async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;
    const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });
    res.status(201).json({
        success:true,
        order
    });
};


//get single order Details
export  const getOrderDetails=async(req,res,next)=>{
const order=await Order.findById(req.params.id).populate("user","name email");
if(!order){
    return next(new errorHandler("Order not found with this id",404))
}
res.status(200).json({
    success:true,
    order,
});
}
//get all order details of a user
export const getAllOrders=async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id});
    if(!orders){
        return next(new errorHandler("No order found for this user",404))
    }
    res.status(200).json({
        success:true,
        orders,
    });

}

//admin
export const getAllOrderByAdmin=async(req,res,next)=>{

    const orders=await Order.find({user:req.user._id});
    if(!orders){
        return next(new errorHandler("No order found",404))
    }
    res.status(200).json({
        success:true,
        orders,
    });
}
// admin get all orders and total amount of orders
  export const getAllOrdersByAdmin=async(req,res,next)=>{
   
    const orders=await Order.find();
   
    if(!orders || orders.length === 0){
        return next(new errorHandler("No order found",404));
       
    }
    let totalAmount=0;
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
      
    });
    res.status(200).json({
        success:true,
        orders,
        totalAmount,
    });

  } 
  //admin delete order
  export const deleteOrder=async(req,res,next)=>{
    console.log(req.params.id);
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new errorHandler("Order not found with this id",404))
    }
    if(order.orderStatus!=="delivered"){
        console.log(order.orderStatus);
        return next(new errorHandler("This order is under processing cannot be deleted",400))
    }
    await Order.deleteOne({_id:req.params.id});
    res.status(200).json({
        success:true,
        message:"Order deleted successfully",
    });
  };
  //Admin order update

  export const updateOrderStatus=async(req,res,next)=>{
    const id=req.params.id;
    const order=await Order.findById(id);
    if(!order){
        return next(new errorHandler("Order not found with this id",404))
    }
    if(order.orderStatus==="delivered"){
        return next(new errorHandler("You have already delivered this order",400))
    }
    //update stock
    await Promise.all(order.orderItems.map((item)=>{
        return updateQuantity(item.product,item.quantity);
    }))
    order.orderStatus=req.body.status;
    if(order.orderStatus==="delivered"){
        order.deliveredAt=Date.now();

    }
 await order.save({validateBeforeSave:false});
 res.status(200).json({
    success:true,
    message:"Order status updated successfully",
    order,
 });

}
    async function updateQuantity(id,quantity){
        const product=await Product.findById(id);
        if(!product){
            throw new Error("Product not found");
        }
        product.stock-=quantity;

    await product.save({validateBeforeSave:false});
    }
   
   

  
  
