import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // "Bearer <token>"
    if (!authHeader) return res.status(401).json({ success: false, message: "Not authorized" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach userId to req
    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message); // <-- prints why it’s invalid
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
