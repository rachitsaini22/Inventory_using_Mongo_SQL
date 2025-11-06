import { sendError, sendSuccess } from "../Helper/responseHelper.js";
import {
  createProductModel,
  getAllProductsModel,
  updateProductModel,
  deleteProductModel,
} from "../models/productModel.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { product_name, price, quantity, category } = req.body;

    if (!product_name || !price || !quantity || !category) {
      return sendError(res, "All fields are required", 400);
    }

    const productData = {
      product_name,
      price,
      quantity,
      category,
      seller_email: req.user.email,
      seller_name: req.user.name,
      seller_id: req.user.id,
    };

    const newProduct = await createProductModel(productData);
    sendSuccess(res, "Product added successfully", newProduct);
  } catch (err) {
    console.error(err);
    sendError(res, err.message || "Error adding product");
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
    const category = req.query.category;
    const search = req.query.search?.trim(); // 🔍 Search term

    // Build filter
    const filter = {
      price: { $gte: minPrice, $lte: maxPrice },
    };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { product_name: { $regex: search, $options: "i" } }, // case-insensitive
        { seller_name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const { products, total } = await getAllProductsModel(filter, skip, limit);

    sendSuccess(res, "Products fetched successfully", {
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    console.error("PRODUCT FETCH ERROR:", err);
    sendError(res, "Error fetching products");
  }
};


// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0)
      return sendError(res, "No fields to update", 400);

    const updated = await updateProductModel(product_id, updates);
    if (!updated) return sendError(res, "Product not found", 404);

    sendSuccess(res, "Product updated successfully", updated);
  } catch (err) {
    console.error(err);
    sendError(res, "Error updating product");
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const deleted = await deleteProductModel(product_id);

    if (!deleted) return sendError(res, "Product not found", 404);
    sendSuccess(res, "Product deleted successfully");
  } catch (err) {
    console.error(err);
    sendError(res, "Error deleting product");
  }
};
