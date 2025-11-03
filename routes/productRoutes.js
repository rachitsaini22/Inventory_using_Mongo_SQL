import express from "express";
import { auth } from "../middlewares/verifyToken.js";
import { isSeller, isAdmin } from "../middlewares/roleAuth.js";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
 
const router = express.Router();

// only seller can create the product
router.post("/create", auth, isSeller, createProduct);

// all users access 
router.get("/all", auth, getAllProducts);

// now seller can update the product 
router.put("/:product_id", auth, isSeller, updateProduct);
//seller can delete the code 
router.delete("/delete/:product_id", auth, isSeller, deleteProduct);

export default router;
