import pool from "../connections/db.js";

// this query will store the session id when the user will login to the application 
export const createSession = (userId, token,  callback) => {
  pool.query(
    "INSERT INTO Sessions (user_id, token) VALUES (?, ?)",
    [userId, token],
    callback
  );
};

//with the help of this query we can select the user sesion id with the help of id
export const getUserSessions = (userId, callback) => {
  pool.query(
    "SELECT * FROM Sessions WHERE user_id = ? ORDER BY created_at ASC",
    [userId],
    callback
  );
};

//with the help of this id we can delet the token of the user so that it will logout 
export const deleteSession = (sessionId, callback) => {
  pool.query("DELETE FROM Sessions WHERE id = ?", [sessionId], callback);
};
