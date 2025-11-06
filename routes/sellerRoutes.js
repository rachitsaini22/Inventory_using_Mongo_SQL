import express from "express";
import {
  createSeller,
  getAllSellers,
  updateSeller,
  getSellerOrders,
  deleteSeller1,
  deleteSeller2,
} from "../controllers/sellerController.js";
import { auth } from "../middlewares/verifyToken.js";
import { isAdmin, isSeller, isSellerOrAdmin } from "../middlewares/roleAuth.js";

const router = express.Router();
//only seller can create the seller profile
router.post("/create", auth, isSeller, createSeller); 
// only admin can see the users who registered         
router.get("/all", auth, isAdmin, getAllSellers);     
// only seller can update the seller details                          
router.put("/update/:id", auth, isSeller, updateSeller);     
// only admin can delete any seller with the help of seller id 
router.delete("/delete/:id", auth, isAdmin , deleteSeller2); 
router.delete("/delete", auth, isSeller , deleteSeller1); 
router.get("/seller/orders",auth, getSellerOrders);
export default router;
