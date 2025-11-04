import {
  insertSeller,
  getAllSellersDB,
  updateSellerDB,
  deleteSellerDB,
  getOrdersBySellerId,
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
//seller orders
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id; // from token middleware
    const orders = await getOrdersBySellerId(sellerId);

    if (orders.length === 0)
      return sendSuccess(res, "No orders found for this seller", []);

    sendSuccess(res, "Orders fetched successfully", orders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    sendError(res, "Error fetching seller orders");
  }
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
