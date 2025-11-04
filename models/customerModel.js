import pool from "../connections/db.js";

// Insert new customer (auto-fetch user details)
export const insertCustomer = async (user_id ,address_line1, postal_code) => {
  // Fetch user details
  const [userRows] = await pool.query("SELECT name, email, phone ,id FROM Users WHERE id = ?", [user_id]);
  if (userRows.length === 0) throw new Error("User not found");

  const { id, name, email, phone} = userRows[0];

  // Insert into Customers
  const [result] = await pool.query(
    "INSERT INTO Customers (user_id, full_name, phone, email, address_line1, postal_code) VALUES (?, ?, ?, ?, ?, ?)",
    [id, name, phone, email, address_line1, postal_code]
  );

  return result;
};

export const getAllCustomers = async () => {
  const [rows] = await pool.query(`
    SELECT c.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
    FROM Customers c
    JOIN Users u ON c.user_id = u.id
  `);
  return rows;
};

export const getCustomerById = async (id) => {
  const [rows] = await pool.query(`
    SELECT c.*, u.name AS user_name, u.email AS user_email, u.phone AS user_phone
    FROM Customers c
    JOIN Users u ON c.user_id = u.id
    WHERE c.id = ?
  `, [id]);
  return rows[0];
};

export const updateCustomerById = async (id, updates) => {
  const { address, postal_code } = updates;
  const [result] = await pool.query(
    "UPDATE customers SET address_line1=?, postal_code=? WHERE id=?",
    [address, postal_code, id]
  );
  return result;
};

export const deleteCustomerById = async (id) => {
  const [result] = await pool.query("DELETE FROM Customers WHERE id=?", [id]);
  return result;
};
