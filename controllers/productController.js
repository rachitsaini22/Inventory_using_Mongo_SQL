import { sendError, sendSuccess } from "../Helper/responseHelper.js";
import {
  createProductModel,
  getAllProductsModel,
  updateProductModel,
  deleteProductModel,
} from "../models/productModel.js";
import { getCategoryByIdModel } from "../models/categoryModel.js";
import client from "../connections/redis.js"; 
// CREATE PRODUCT

export const createProduct = async (req, res) => {
  try {
    const { product_name, price, quantity, category_id } = req.body;

    if (!product_name || !price || !quantity ||  !category_id ) {
      return sendError(res, "All fields are required", 400);
    }
    

    // Fetch category details from MySQL
    const category = await getCategoryByIdModel(category_id);
    if (!category) {
      return sendError(res, "Invalid category_id. Category not found.", 404);
    }

    // Add category details to product data
    const productData = {
      product_name,
      seller_name: req.user.name,
      seller_email: req.user.email,
      seller_id: req.user.id,
      price,
      quantity,
      category_id: category.category_id,
      category_name: category.category_name,
    };

    const newProduct = await createProductModel(productData);
    await client.del("allProducts");
    sendSuccess(res, "Product created successfully", newProduct);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    sendError(res, "Error creating product");
  }
};

// GET ALL PRODUCTS (with Redis caching)
export const getAllProducts = async (req, res) => {
  try {
    console.time(" getAllProducts API Time"); // Start timer

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
    const category = req.query.category;
    const search = req.query.search?.trim();

    // Build filter
    const filter = {
      price: { $gte: minPrice, $lte: maxPrice },
    };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { product_name: { $regex: search, $options: "i" } },
        { seller_name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const cacheKey = `products:${JSON.stringify({ filter, page, limit })}`;

    // Check Redis cache first
    const cacheData = await client.get(cacheKey);
    if (cacheData) {
      console.log("Redis cache hit");
      console.timeEnd(" getAllProducts API Time"); // End timer here
      return sendSuccess(res, "Products fetched (from cache)", JSON.parse(cacheData));
    }

    console.log("Redis cache miss — fetching from DB");
    const { products, total } = await getAllProductsModel(filter, skip, limit);

    const responseData = {
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    };

    // Store data in Redis for 60 seconds
    await client.set(cacheKey, JSON.stringify(responseData), { EX: 60 });

    console.timeEnd(" getAllProducts API Time"); // End timer after DB fetch
    sendSuccess(res, "Products fetched successfully", responseData);
  } catch (err) {
    console.error("PRODUCT FETCH ERROR:", err);
    console.timeEnd("getAllProducts API Time");
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
    await client.del("allProducts");
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
    await client.del("allProducts");
    sendSuccess(res, "Product deleted successfully");
  } catch (err) {
    console.error(err);
    sendError(res, "Error deleting product");
  }
};
