import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// password hashing
export const hashPassword = (password, callback) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return callback(err);
    callback(null, hashedPassword);
  });
};

// in this we are compare the passwords 
export const comparePassword = (plainPassword, hashedPassword, callback) => {
  bcrypt.compare(plainPassword, hashedPassword, (err, match) => {
    if (err) return callback(err);
    callback(null, match);
  });
};

// genrating token 
export const generateToken = (user, callback) => {
  try {
    //this is the payload in object form 
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role, 
    };

    const token = jwt.sign(payload, process.env.JWT, {
      expiresIn: "1h",
    });

    callback(null, token);
  } catch (err) {
    callback(err);
  }
};