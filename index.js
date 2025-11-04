import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/user1.js";
import productRoutes from "./routes/productRoutes.js";
import { dbconnect } from "./connections/mongo.js"; 
import sellerRoutes from "./routes/sellerRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import OrderRoutes from "./routes/OrderRoutes.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

dbconnect();

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/order" , OrderRoutes);
app.listen(3000, () => {
  console.log(" Server running on http://localhost:3000");
});
