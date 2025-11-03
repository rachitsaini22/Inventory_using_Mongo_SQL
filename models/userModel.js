import pool from "../connections/db.js";

// creating the new user while sign up 
export const insertUser = (name, email, password, role, callback) => {
  pool.query(
    "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role],
    callback
  );
};

// get the user date with the help of email will be used for login 
export const findUserByEmail = (email, callback) => {
  pool.query("SELECT * FROM Users WHERE email = ?", [email], callback);
};

// get all user
export const getAllUsersDB = (callback) => {
  pool.query("SELECT * FROM Users", callback);
};


// used for updating the user 
export const updateUserDB = (name, id, callback) => {
  pool.query("UPDATE Users SET name = ? WHERE id = ?", [name, id], callback);
};

// we can delet the current user data who is login to platform 
export const deleteUserDB = (id, callback) => {
  pool.query("DELETE FROM Users WHERE id = ?", [id], callback);
};
