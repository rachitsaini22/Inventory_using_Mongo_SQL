import {
  insertCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
} from "../models/customerModel.js";
import { sendError, sendSuccess } from "../Helper/responseHelper.js";

export const createCustomer = async (req, res) => {
  try {
     const user_id = req.user.id;
    const { address, postal_code } = req.body;
   console.log(user_id);
   
    if (!user_id) return sendError(res, "User not authenticated", 401);
    if (!address || !postal_code) return sendError(res, "Address and postal code are required");

    const result = await insertCustomer( user_id, address, postal_code);
    sendSuccess(res, "Customer created successfully", { id: result.insertId });
  } catch (error) {
    console.error(error);
    sendError(res, error.message || "Error creating customer");
  }
};

export const getCustomers = async (req, res) => {
  try {
    const data = await getAllCustomers();
    sendSuccess(res, "Customers fetched successfully", data);
  } catch (error) {
    sendError(res, "Error fetching customers");
  }
};

export const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerById(id);
    if (!customer) return sendError(res, "Customer not found", 404);
    sendSuccess(res, "Customer fetched successfully", customer);
  } catch (error) {
    sendError(res, "Error fetching customer");
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const result = await updateCustomerById(id, updates);
    if (result.affectedRows === 0) return sendError(res, "Customer not found", 404);
    sendSuccess(res, "Customer updated successfully");
  } catch (error) {
    sendError(res, "Error updating customer");
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteCustomerById(id);
    if (result.affectedRows === 0) return sendError(res, "Customer not found", 404);
    sendSuccess(res, "Customer deleted successfully");
  } catch (error) {
    sendError(res, "Error deleting customer");
  }
};
