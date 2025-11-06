import pool from "../connections/db.js";

// Create a new user during signup
export const insertUser = async (name, email, phone, password, role) => {
  const [result] = await pool.query(
    "INSERT INTO Users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
    [name, email, phone, password, role]
  );
  return result;
};

// Get user data by email (for login)
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [email]);
  return rows;
};

// Get all users
export const getAllUsersDB = async () => {
  const [rows] = await pool.query("SELECT * FROM Users");
  return rows;
};

//  Update user by ID
export const updateUserDB = async (name, id) => {
  const [result] = await pool.query("UPDATE Users SET name = ? WHERE id = ?", [name, id]);
  return result;
};

// Delete user by ID
export const deleteUserDB = async (id) => {
  const [result] = await pool.query("DELETE FROM Users WHERE id = ?", [id]);
  return result;
};
