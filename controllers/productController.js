import { sendError, sendSuccess } from "../Helper/responseHelper.js";
import Product from "../schema/productSchema.js";


export const createProduct = async (req, res) => {
  try {
    const { product_name, price, quantity, seller_name, category, product_id } = req.body;

    if (!product_name || !price || !quantity || !seller_name || !category || !product_id) {
      return sendError(res, "All fields are required", 400);
    }

    const newProduct = new Product({
      product_id,
      product_name,
      price,
      quantity,
      seller_name,
      category,
      seller_id: req.user.id
    });

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

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const  product_id  = req.params;
    const updates = req.body;

    const updated = await Product.findOneAndUpdate(
      { product_id },
        updates,
      { new: true }
    );

    if (!updated) return sendError(res, "Product not found", 404);
    sendSuccess(res, "Product updated successfully", updated);
  } catch (err) {
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
