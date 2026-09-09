import express from "express"
import { addToCart, removeFromCart, deleteFromCart, getCart, syncCart } from "../controllers/CartController.js"
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart)
cartRouter.post("/remove", authMiddleware, removeFromCart)
cartRouter.post("/delete", authMiddleware, deleteFromCart)
cartRouter.post("/get", authMiddleware, getCart)
cartRouter.post("/sync", authMiddleware, syncCart)

export default cartRouter;