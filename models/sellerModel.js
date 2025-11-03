import pool from "../connections/db.js";

// Create new seller
export const insertSeller = (user_id, shop_name, location, phone, callback) => {
  pool.query(
    "INSERT INTO seller_details (user_id, shop_name, location, phone) VALUES (?, ?, ?, ?)",
    [user_id, shop_name, location, phone],
    callback
  );
};

// Get all sellers
export const getAllSellersDB = (callback) => {
  pool.query("SELECT * FROM seller_details", callback);
};

// Update seller details
export const updateSellerDB = (id, shop_name, location, phone, callback) => {
  pool.query(
    "UPDATE seller_details SET shop_name = ?, location = ?, phone = ? WHERE id = ?",
    [shop_name, location, phone, id],
    callback
  );
};

// Delete seller
export const deleteSellerDB = (id, callback) => {
  pool.query("DELETE FROM seller_details WHERE id = ?", [id], callback);
};
