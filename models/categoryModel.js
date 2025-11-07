import pool from "../connections/db.js";

//  Insert new category (Admin only)
export const createCategoryModel = async (category_name) => {
  const [result] = await pool.query(
    "INSERT INTO categories (category_name) VALUES (?)",
    [category_name]
  );
  return result;
};

//  Delete category (Admin only)
export const deleteCategoryModel = async (id) => {
  const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
  return result;
};

//  Get all categories (For all users)
export const getAllCategoriesModel = async () => {
  const [rows] = await pool.query("SELECT * FROM categories");
  return rows;
};

// Fetch category by ID
export const getCategoryByIdModel = async (category_id) => {
  const [rows] = await pool.query(
    "SELECT id AS category_id, category_name FROM categories WHERE id = ?",
    [category_id]
  );
  return rows[0];
};