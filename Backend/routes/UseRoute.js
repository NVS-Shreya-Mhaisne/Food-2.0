import express from "express";
import { 
    loginUser, 
    registerUser, 
    getFavorites, 
    toggleLikeFood, 
    toggleLikeRestaurant,
    getUserProfile,
    updateUserProfile
} from "../controllers/UserController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/favorites", authMiddleware, getFavorites);
userRouter.post("/toggle-like-food", authMiddleware, toggleLikeFood);
userRouter.post("/toggle-like-restaurant", authMiddleware, toggleLikeRestaurant);
userRouter.get("/profile", authMiddleware, getUserProfile);
userRouter.post("/profile/update", authMiddleware, updateUserProfile);

export default userRouter;