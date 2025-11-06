import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//  Hash password
export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    throw new Error("Error hashing password");
  }
};

// Compare plain text and hashed password
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (err) {
    throw new Error("Error comparing passwords");
  }
};

//  Generate JWT token
export const generateToken = async (user) => {
  try {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT, { expiresIn: "1h" });
    return token;
  } catch (err) {
    throw new Error("Error generating token");
  }
};
