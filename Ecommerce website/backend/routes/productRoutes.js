import express from "express";
import { addProducts, adminDeleteReview, createProductReview, deleteProduct, getAllProducts, getAllProductsByAdmin, getSingleProduct, updateProduct, viewProductReviews } from "../controller/productController.js";
import { roleBasedAccess, verifyUser } from "../helper/userAuth.js";
//import { roleBasedAccess } from "../helper/userAuth.js";
const router = express.Router();


//user side

router.get("/products",getAllProducts);
router.route('/product/:id').get(getSingleProduct);
router.route("/review").put(verifyUser,createProductReview);
//user review

//Admin
router.route ('admin/product/create').post(verifyUser,roleBasedAccess("admin"),addProducts);
//router.get('/product/:id',getSingleProduct);
//router.put('/product/:id',updateProduct);
//router.deletet('/product/:id',deleteProduct);

router.route('/admin/product/product/:id').put(verifyUser,roleBasedAccess("admin"),updateProduct)
.delete(verifyUser,roleBasedAccess("admin"), deleteProduct);
router.route("/admin/reviews").get(verifyUser,roleBasedAccess("admin"),viewProductReviews).delete
(verifyUser,roleBasedAccess("admin"),adminDeleteReview);
router.route("/admin/products").get(verifyUser,roleBasedAccess("admin"),getAllProductsByAdmin);
//admin view all products
//admin view review and delete review 

//router.route("/user/review").put(verifyUser,createProductReview);

// router.route("/user/review").put(
//     verifyUser,
//     createProductReview
// );
export default router;

// db.products.aggregate([
//     {
//         $group:{
//             _id:"$category",
//             count:{$sum:1}
//         }
//     },
//     {
//         $sort:{count:-1}
//     },
//     {
//         $project:{
//             category:"$_id",
//             count:1,
//             _id:0
//         }
//     }
// ])