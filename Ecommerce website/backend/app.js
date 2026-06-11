import express from "express";
import cors from "cors";
import product from "./routes/productRoutes.js";
import user from "./routes/userRoutes.js";
import order from "./routes/orderRoute.js";
import errorHandler from "./middleware/error.js"
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser())

app.use("/api/v1/",product);

app.use("/api/v1/",user);


app.use("/api/v1/",order);
app.use(errorHandler);


export default app;

