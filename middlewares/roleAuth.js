export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin access only" });
    }
    next();
  } catch (err) {
    console.error("Error in isAdmin middleware:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const isSellerOrAdmin = async (req, res, next) => {
  try {
    if (!req.user || (req.user.role !== "seller" && req.user.role !== "admin")) {
      return res.status(403).json({ message: "Access denied: Only seller or admin allowed" });
    }
    next();
  } catch (err) {
    console.error("Error in isSellerOrAdmin middleware:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const isSeller = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied: Seller access only" });
    }
    next();
  } catch (err) {
    console.error("Error in isSeller middleware:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const isCustomer = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "customer") {
      return res.status(403).json({ message: "Access denied: Customer access only" });
    }
    next();
  } catch (err) {
    console.error("Error in isCustomer middleware:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
