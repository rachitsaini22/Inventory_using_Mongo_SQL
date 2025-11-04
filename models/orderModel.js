import pool from "../connections/db.js";

// CREATE ORDER
export const createOrderModel = async (user_id, product_id, quantity, total_price, status) => {
  const [result] = await pool.query(
    "INSERT INTO Orders (user_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)",
    [user_id, product_id, quantity, total_price, status]
  );
  return result;
};

// GET ORDERS BY USER
export const getOrdersByUserModel = async (user_id) => {
  return pool.query("SELECT * FROM orders WHERE user_id = ?", [user_id]);
};

// UPDATE ORDER STATUS
export const updateOrderStatusModel = async (order_id, status) => {
  return pool.query("UPDATE orders SET status = ? WHERE order_id = ?", [status, order_id]);
};

// DELETE ORDER
export const deleteOrderModel = async (order_id) => {
  return pool.query("DELETE FROM orders WHERE order_id = ?", [order_id]);
};
