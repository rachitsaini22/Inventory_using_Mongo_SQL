//query importing from models
import {
  insertUser,
  findUserByEmail,
  getAllUsersDB,
  updateUserDB,
  deleteUserDB,
} from "../models/userModel.js";
//query for session management
import {
  createSession,
  getUserSessions,
  deleteSession,
} from "../models/sessionModel.js";
// encreption and token genration from helper 
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../Helper/authHelper.js";
// response function for better view and that is reusable from helper
import { sendError, 
  sendSuccess } from "../Helper/responseHelper.js";

// SIGNUP
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validate inputs
    if (!name || !email || !password || !role || !phone) {
      return sendError(res, "All fields are required", 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user into SQL
    const result = await insertUser(name, email, phone, hashedPassword, role);

    if (!result || result.affectedRows === 0) {
      return sendError(res, "Failed to register user");
    }

    // Success
    return sendSuccess(res, "User registered successfully!");
  } catch (err) {
    console.error("Signup error:", err);
    return sendError(res, "Error saving user");
  }
};

//LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return sendError(res, "Email and password required", 400);

    // Fetch user by email
    const [user] = await findUserByEmail(email);
    if (!user) return sendError(res, "User not found", 404);

    console.log("User found:", user.name);

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) return sendError(res, "Incorrect password", 401);

    // Create payload
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    //  Generate token
    const token = await generateToken(payload);

    //  Fetch active sessions
    const sessions = await getUserSessions(user.id);

    //  If user already has 2 active sessions, delete the oldest one
    if (sessions && sessions.length >= 2) {
      await deleteSession(sessions[0].id);
    }

    //  Create a new session
    await createSession(user.id, token || "unknown");

    // Send the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    // Send success response
    return sendSuccess(res, `Welcome ${user.name}! You are logged in as ${user.role}.`);

  } catch (error) {
    console.error("Error in loginUser:", error);
    return sendError(res, "Internal server error", 500);
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const results = await getAllUsersDB();
    sendSuccess(res, "Users fetched successfully", results);
  } catch (err) {
    sendError(res, "Error fetching users");
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.user; // Comes from middleware (decoded token)
    const { name, phone } = req.body; // You can add more fields as needed

    if (!name && !phone)
      return sendError(res, "No fields provided for update", 400);

    await updateUserDB(name, phone, id);
    sendSuccess(res, "User updated successfully!");
  } catch (err) {
    sendError(res, "Error updating user");
  }
};

//  DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.user;
    await deleteUserDB(id);
    sendSuccess(res, "User deleted successfully!");
  } catch (err) {
    sendError(res, "Error deleting user");
  }
};

// LOGOUT USER
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });

  sendSuccess(res, "Logged out successfully");
};
