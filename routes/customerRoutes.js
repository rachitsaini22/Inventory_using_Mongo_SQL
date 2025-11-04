import express from "express";

import { auth } from "../middlewares/verifyToken.js";
import { isAdmin, isSeller, isCustomer } from "../middlewares/roleAuth.js";
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.post("/create",auth,isCustomer, createCustomer);
router.get("/", auth, isAdmin, getCustomers);
router.get("/:id",auth, isAdmin, getCustomer);
router.put("/:id",auth, isCustomer, updateCustomer);
router.delete("/:id",isAdmin, deleteCustomer);

export default router;
