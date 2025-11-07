import Product from "../schema/productSchema.js";

// CREATE PRODUCT
export const createProductModel = async (data) => {
  const newProduct = new Product(data);
  return await newProduct.save();
};

// GET ALL PRODUCTS with filters, search, and pagination
export const getAllProductsModel = async (filter, skip, limit) => {
  const products = await Product.find(filter, { _id: 0 , __v: 0})
    .skip(skip)
    .limit(limit);
  const total = await Product.countDocuments(filter);
  return { products, total };
};

// UPDATE PRODUCT
export const updateProductModel = async (product_id, updates) => {
  return await Product.findOneAndUpdate(
    { product_id },
    { $set: updates },
    { new: true }
  );
};

// DELETE PRODUCT
export const deleteProductModel = async (product_id) => {
  return await Product.findOneAndDelete({ product_id });
};
