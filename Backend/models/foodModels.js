import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    ingredients: { type: String, default: "" },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
    restaurantName: { type: String, default: "" },
    isTopDish: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const FoodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default FoodModel;