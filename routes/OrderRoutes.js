import express from "express";
import {
  createOrder,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder1,
  deleteOrder2,
  getCategoryReport,
  getSellerReport
} from "../controllers/orderController.js";

import { auth } from "../middlewares/verifyToken.js";
import { isAdmin, isSeller, isCustomer } from "../middlewares/roleAuth.js";


const router = express.Router();

// Customer creates a new order
router.post("/create", auth, isCustomer, createOrder);

//  Fetch orders of a particular user (Customer)
router.get("/user", auth, getOrdersByUser);

//  Seller/Admin updates order status
router.put("/update/:order_id", auth, isSeller, updateOrderStatus);


// Admin deletes an order
router.delete("/cancel/:order_id", auth, isSeller, deleteOrder1);
router.delete("/cancel/", auth, isCustomer, deleteOrder2)

router.get("/cat/report", auth, isAdmin, getCategoryReport);
router.get("/sell/report", auth, isAdmin, getSellerReport);
export default router;
