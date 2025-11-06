import pool from "../connections/db.js";
import Product from "../schema/productSchema.js"; // Mongo model
// Create new seller
export const insertSeller = (user_id, shop_name, location, phone, callback) => {
  pool.query(
    "INSERT INTO seller_details (user_id, shop_name, location, phone) VALUES (?, ?, ?, ?)",
    [user_id, shop_name, location, phone],
    callback
  );
};

//order for seller
export const getOrdersBySellerId = async (sellerId) => {
  const [orders] = await pool.query(
    `SELECT 
    o.id AS order_id,
    o.product_id,
    o.quantity,
    o.total_price,
    c.address_line1,
    c.phone,
    c.email
FROM orders o
JOIN customers c ON o.user_id = c.user_id
WHERE o.seller_id = ?`,
    [sellerId]
  );

  // Now fetch product details from MongoDB for each order
  const ordersWithProducts = await Promise.all(
    orders.map(async (order) => {
      const product = await Product.findOne({ product_id: order.product_id });
      return {
        ...order,
        product_name: product?.product_name || "Unknown Product",
        price: product?.price || 0,
      };
    })
  );

  return ordersWithProducts;
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
