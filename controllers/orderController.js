import {
  createOrderModel,
  getOrdersByUserModel,
  updateOrderStatusModel,
  deleteOrderModel
} from "../models/orderModel.js";

import { sendError, sendSuccess } from "../Helper/responseHelper.js";
import Product from "../schema/productSchema.js"; // ✅ MongoDB Product model

export const createOrder = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    if (!product_id || !quantity) {
      return sendError(res, "All fields are required");
    }

    // ✅ Check product availability from MongoDB
    const product = await Product.findOne({ product_id });
    if (!product) return sendError(res, "Product not found", 404);

    if (product.quantity < quantity)
      return sendError(res, "Not enough stock available", 400);

    const total_price = product.price * quantity;

    // ✅ Extract seller details (for delivery info or record)
    const seller_email = product.seller_email || null;
    const seller_name = product.seller_name || null;

    // ✅ Create order record in MySQL
    await createOrderModel(user_id, product_id, quantity, total_price, "pending");

    // ✅ Update product stock in MongoDB
    product.quantity -= quantity;
    await product.save();

    // ✅ Send success with optional seller info
    sendSuccess(res, "Order placed successfully", {
      product_name: product.product_name,
      seller_email,
      seller_name,
      total_price,
      quantity,
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    sendError(res, "Error placing order");
  }
};


// GET ORDERS BY USER
export const getOrdersByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const [orders] = await getOrdersByUserModel(user_id);
    sendSuccess(res, "Orders fetched successfully", orders);
  } catch (err) {
    sendError(res, "Error fetching orders");
  }
};

// UPDATE ORDER STATUS (Admin/Seller)
export const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) return sendError(res, "Invalid status");

    await updateOrderStatusModel(order_id, status);
    sendSuccess(res, "Order status updated successfully");
  } catch (err) {
    sendError(res, "Error updating order status");
  }
};

// DELETE ORDER (Admin only)
export const deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    await deleteOrderModel(order_id);
    sendSuccess(res, "Order deleted successfully");
  } catch (err) {
    sendError(res, "Error deleting order");
  }
};
