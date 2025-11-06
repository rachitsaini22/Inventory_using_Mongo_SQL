import { sendError, sendSuccess } from "../Helper/responseHelper.js";
import {
  createCategoryModel,
  deleteCategoryModel,
  getAllCategoriesModel,
} from "../models/categoryModel.js";

// ✅ Admin: Add new category
export const createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) return sendError(res, "Category name is required");

    await createCategoryModel(category_name);
    sendSuccess(res, "Category added successfully");
  } catch (err) {
    console.error("CREATE CATEGORY ERROR:", err);
    sendError(res, "Error adding category");
  }
};

// ✅ Admin: Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCategoryModel(id);
    sendSuccess(res, "Category deleted successfully");
  } catch (err) {
    console.error("DELETE CATEGORY ERROR:", err);
    sendError(res, "Error deleting category");
  }
};

// ✅ All users: Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesModel();
    sendSuccess(res, "Categories fetched successfully", categories);
  } catch (err) {
    console.error("GET CATEGORY ERROR:", err);
    sendError(res, "Error fetching categories");
  }
};
