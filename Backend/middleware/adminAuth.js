// middleware/adminAuth.js
import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: "No authorization header. Please log in again." });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Token missing. Please log in again." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("adminAuth error:", error.message);
    res.status(401).json({ success: false, message: "Session expired or invalid token. Please log out and log in again." });
  }
};

export default adminAuth;
