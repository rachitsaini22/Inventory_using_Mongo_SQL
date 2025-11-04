import { sendError, sendSuccess } from "../Helper/responseHelper.js";
import Product from "../schema/productSchema.js";


export const createProduct = async (req, res) => {
  try {
    const { product_name, price, quantity,  category } = req.body;

    if (!product_name || !price || !quantity || !category ) {
      return sendError(res, "All fields are required", 400);
    }

    const newProduct = new Product({
      product_name,
      price,
      quantity,
      category,
      seller_email: req.user.email,
      seller_name: req.user.name,
      seller_id: req.user.id
    });
   console.log(req.user.name , req.user.email);
   
    await newProduct.save();
    sendSuccess(res, "Product added successfully", newProduct);
  } catch (err) {
    sendError(res, err.message || "Error adding product");
  }
};
// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}, { _id: 0,createdAt :0 });
    sendSuccess(res, "Products fetched successfully", products);
  } catch (err) {
    sendError(res, "Error fetching products");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params; // ✅ correctly extract param
    const updates = req.body;

    // Check if request body is empty
    if (Object.keys(updates).length === 0) {
      return sendError(res, "No fields to update", 400);
    }

    // Find and update product
    const updated = await Product.findOneAndUpdate(
      { product_id },
      { $set: updates }, // ✅ use $set to only update provided fields
      { new: true }
    );

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

    const deleted = await Product.findOneAndDelete({ product_id });
    if (!deleted) return sendError(res, "Product not found", 404);

    sendSuccess(res, "Product deleted successfully");
  } catch (err) {
    sendError(res, "Error deleting product");
  }
};
