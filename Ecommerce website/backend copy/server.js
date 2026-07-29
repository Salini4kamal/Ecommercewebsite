import app from  "./app.js";
  import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config({path:"backend/config/config.env"});
const PORT = process.env.PORT || 8000;
connectDB();

const server=app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`server is shutting down,due to unhandled rejection`);
    server.close(()=>{
        process.exit(1)
    })
})
