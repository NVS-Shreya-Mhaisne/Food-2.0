import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, default: "Cravely Partner" },
  establishedYear: { type: String, default: "2020" },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  priceRange: { type: String, default: "₹₹ Moderate" },
  deliveryTime: { type: String, default: "20-30 mins" },
  location: { type: String, required: true },
  image: { type: String, default: "" },
  imagePublicId: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const RestaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);

export default RestaurantModel;
