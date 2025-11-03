import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json("auth required");
  }

  try {
    const value = jwt.verify(token, process.env.JWT);
    req.user = value; 
    next();
  } catch (err) {
    res.status(403).json("Invalid token");
  }
};
