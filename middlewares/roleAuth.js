export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json("Admin access only");
  }
  next();
};

export const isSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    console.log(req.user.role)
    return res.status(403).json("Seller access only");
  }
  next();
};

export const isCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json("Customer access only");
  }
  next();
};
