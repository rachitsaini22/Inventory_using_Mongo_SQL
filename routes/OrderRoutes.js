import express from "express";
import {
  createOrder,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder
} from "../controllers/orderController.js";

import { auth } from "../middlewares/verifyToken.js";
import { isAdmin, isSeller, isCustomer } from "../middlewares/roleAuth.js";

const router = express.Router();

// Customer creates a new order
router.post("/create", auth, isCustomer, createOrder);

//  Fetch orders of a particular user (Customer)
router.get("/user/:user_id", auth,isCustomer, getOrdersByUser);

//  Seller/Admin updates order status
router.put("/update/:order_id", auth, isCustomer, updateOrderStatus);

// Admin deletes an order
router.delete("/cancel/:order_id", auth, isCustomer, deleteOrder);

export default router;
