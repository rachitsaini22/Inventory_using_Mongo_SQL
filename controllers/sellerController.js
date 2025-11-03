import {
  insertSeller,
  getAllSellersDB,
  
  updateSellerDB,
  deleteSellerDB,
} from "../models/sellerModel.js";

import { sendError, sendSuccess } from "../Helper/responseHelper.js";

// CREATE SELLER
export const createSeller = (req, res) => {
  const user_id = req.user.id; // from token
  const { shop_name, location, phone } = req.body;

  if (!shop_name)
    return sendError(res, "Shop name is required", 400);

  insertSeller(user_id, shop_name, location, phone, (err) => {
    if (err) return sendError(res, "Error saving seller");
    sendSuccess(res, "Seller profile created successfully!");
  });
};

// GET ALL SELLERS (Admin only)
export const getAllSellers = (req, res) => {
  getAllSellersDB((err, results) => {
    if (err) return sendError(res, "Error fetching sellers");
    sendSuccess(res, "Sellers fetched successfully", results);
  });
};


// UPDATE SELLER
export const updateSeller = (req, res) => {
  const { id } = req.params;
  const { shop_name, location, phone } = req.body;

  updateSellerDB(id, shop_name, location, phone, (err) => {
    if (err) return sendError(res, "Error updating seller");
    sendSuccess(res, "Seller updated successfully!");
  });
};

// DELETE SELLER (Admin only)
export const deleteSeller = (req, res) => {
  const { id } = req.params;

  deleteSellerDB(id, (err) => {
    if (err) return sendError(res, "Error deleting seller");
    sendSuccess(res, "Seller deleted successfully!");
  });
};
