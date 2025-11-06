import {
  createOrderModel,
  getOrdersByUserModel,
  updateOrderStatusModel,
  deleteOrderModel,
  getCategoryReportModel,
  getSellerReportModel
} from "../models/orderModel.js";

import { sendError, sendSuccess } from "../Helper/responseHelper.js";
import Product from "../schema/productSchema.js"; // MongoDB Product model

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    if (!product_id || !quantity) {
      return sendError(res, "All fields are required");
    }

    // Check product availability from MongoDB
    const product = await Product.findOne({ product_id });
    if (!product) return sendError(res, "Product not found", 404);
    if (product.quantity < quantity)
      return sendError(res, "Not enough stock available", 400);

    const total_price = product.price * quantity;

    // Extract seller details
    const seller_id = product.seller_id || null;
    const seller_email = product.seller_email || null;
    const seller_name = product.seller_name || null;
    const seller_cat = product.category||null;
    // Create order in MySQL including seller_id
    await createOrderModel(user_id, product_id, quantity, total_price, "pending", seller_id, seller_cat);

    // Update stock in MongoDB
    product.quantity -= quantity;
    await product.save();

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
    const user_id = req.user.id ;
    console.log(req.user.id);
    
    const [orders] = await getOrdersByUserModel(user_id);

    // Optionally attach product name from MongoDB
    const ordersWithProduct = await Promise.all(
      orders.map(async (order) => {
        const product = await Product.findOne({ product_id: order.product_id });
        return {
          ...order,
          product_name: product?.product_name || "Product not found",
          price: product?.price || 0,
        };
      })
    );

    sendSuccess(res, "Orders fetched successfully", ordersWithProduct);
  } catch (err) {
    console.error(err);
    sendError(res, "Error fetching orders");
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) return sendError(res, "Invalid status");

    await updateOrderStatusModel(order_id, status);
    sendSuccess(res, "Order status updated successfully");
  } catch (err) {
    console.error(err);
    sendError(res, "Error updating order status");
  }
};

// seller can DELETE ORDER with the help of id 
export const deleteOrder1 = async (req, res) => {
  try {
    const { order_id } = req.params;
    await deleteOrderModel(order_id);
    sendSuccess(res, "Order deleted successfully");
  } catch (err) {
    console.error(err);
    sendError(res, "Error deleting order");
  }
};
//coutomer can delet the order
export const deleteOrder2 = async (req, res) => {
  try {
    const order_id = req.user.id;
    await deleteOrderModel(order_id);
    sendSuccess(res, "Order deleted successfully");
  } catch (err) {
    console.error(err);
    sendError(res, "Error deleting order");
  }
};

export const getCategoryReport = async (req, res) => {
  try {
    const report = await getCategoryReportModel();

    if (!report || report.length === 0) {
      return sendError(res, "No sales data found");
    }

    sendSuccess(res, "Category-wise sales report fetched successfully", report);
  } catch (err) {
    console.error("CATEGORY REPORT ERROR:", err);
    sendError(res, "Error fetching category report");
  }
};

export const getSellerReport = async (req, res) => {
  try {
    const report = await getSellerReportModel();

    if (!report || report.length === 0) {
      return sendError(res, "No seller sales data found");
    }

    sendSuccess(res, "Seller-wise sales report fetched successfully", report);
  } catch (err) {
    console.error("SELLER REPORT ERROR:", err);
    sendError(res, "Error fetching seller report");
  }
};