import pool from "../connections/db.js";

// CREATE ORDER
export const createOrderModel = async (user_id, product_id, quantity, total_price, status, seller_id,seller_cat) => {
  const [result] = await pool.query(
    "INSERT INTO Orders (user_id, product_id, quantity, total_price, status, seller_id,seller_cat) VALUES (?, ?, ?, ?, ?, ?,?)",
    [user_id, product_id, quantity, total_price, status, seller_id,seller_cat]
  );
  return result;
};


// GET ORDERS BY USER
export const getOrdersByUserModel = async (user_id) => {
  return pool.query("SELECT * FROM orders WHERE user_id = ?", [user_id]);
};

// UPDATE ORDER STATUS
export const updateOrderStatusModel = async (order_id, status) => {
  return pool.query("UPDATE orders SET status = ?WHERE id = ?", [status, order_id]);
};

// DELETE ORDER
export const deleteOrderModel = async (order_id) => {
  return pool.query("DELETE FROM orders WHERE user_id = ?", [order_id]);
};


export const getCategoryReportModel = async () => {
  const [rows] = await pool.query(`
    SELECT 
      o.seller_cat AS category,
      COUNT(o.id) OVER (PARTITION BY o.seller_cat) AS total_orders,
      SUM(o.quantity) OVER (PARTITION BY o.seller_cat) AS total_quantity,
      SUM(o.total_price) OVER (PARTITION BY o.seller_cat) AS total_sales,
      o.id, o.user_id, o.product_id, o.quantity, o.total_price, o.status, o.seller_id
    FROM orders o
    ORDER BY o.seller_cat;
  `);
  return rows;
};


export const getSellerReportModel = async () => {
  // 1️Fetch summary per seller
  const [summaryRows] = await pool.query(`
    SELECT 
      u.name AS seller_name,
      COUNT(o.id) AS total_orders,
      SUM(o.quantity) AS total_quantity,
      SUM(o.total_price) AS total_sales
    FROM orders o
    JOIN users u ON o.seller_id = u.id
    GROUP BY u.name;
  `);

  // 2️ Fetch all orders with seller info
  const [orderRows] = await pool.query(`
    SELECT 
      o.id, 
      o.user_id, 
      o.product_id, 
      o.quantity, 
      o.total_price, 
      o.status, 
      o.seller_id, 
      o.seller_cat, 
      u.name AS seller_name
    FROM orders o
    JOIN users u ON o.seller_id = u.id;
  `);

  // 3️Combine both into structured seller report
  const report = summaryRows.map(seller => {
    const orders = orderRows.filter(o => o.seller_name === seller.seller_name);
    return {
      seller_name: seller.seller_name,
      total_orders: seller.total_orders,
      total_quantity: seller.total_quantity,
      total_sales: seller.total_sales,
      orders, // attach all orders for this seller
    };
  });

  return report;
};

