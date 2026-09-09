import RestaurantModel from "../models/RestaurantModel.js";
import FoodModel from "../models/foodModels.js";
import cloudinary from "../config/cloudinary.js";

export const addRestaurant = async (req, res) => {
  try {
    const { name, ownerName, establishedYear, rating, priceRange, deliveryTime, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ success: false, message: "Restaurant name and location are required" });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      if (req.file.path && req.file.path.startsWith("http")) {
        imageUrl = req.file.path;
        imagePublicId = req.file.filename || req.file.public_id || "";
      } else if (req.file.filename) {
        const host = req.get("host") || "localhost:4000";
        const protocol = req.protocol || "http";
        imageUrl = `${protocol}://${host}/images/${req.file.filename}`;
        imagePublicId = req.file.filename;
      } else if (req.file.path) {
        imageUrl = req.file.path;
      }
    }

    const restaurant = await RestaurantModel.create({
      name,
      ownerName: ownerName || "Cravely Partner",
      establishedYear: establishedYear || "2021",
      rating: rating ? Number(rating) : 4.5,
      priceRange: priceRange || "₹₹ Moderate",
      deliveryTime: deliveryTime || "20-30 mins",
      location,
      image: imageUrl,
      imagePublicId
    });

    res.status(201).json({
      success: true,
      message: "Restaurant added successfully",
      restaurant
    });
  } catch (error) {
    console.error("Add Restaurant Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listRestaurants = async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find().sort({ createdAt: -1 }).lean();
    const restaurantsWithCounts = await Promise.all(
      restaurants.map(async (rest) => {
        const itemCount = await FoodModel.countDocuments({ restaurantId: rest._id });
        return {
          ...rest,
          itemCount
        };
      })
    );

    res.json({ success: true, data: restaurantsWithCounts });
  } catch (error) {
    console.error("List Restaurants Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await RestaurantModel.findById(id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    const foodItems = await FoodModel.find({ restaurantId: id });
    res.json({
      success: true,
      data: {
        restaurant,
        items: foodItems,
        itemCount: foodItems.length
      }
    });
  } catch (error) {
    console.error("Get Restaurant Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.body;

    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    if (restaurant.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(restaurant.imagePublicId);
      } catch (err) {
        console.error("Cloudinary image delete error:", err);
      }
    }
    await FoodModel.deleteMany({ restaurantId });
    await RestaurantModel.findByIdAndDelete(restaurantId);

    res.json({ success: true, message: "Restaurant and its food items deleted successfully" });
  } catch (error) {
    console.error("Remove Restaurant Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { restaurantId, name, rating, priceRange, deliveryTime, location } = req.body;

    const updated = await RestaurantModel.findByIdAndUpdate(
      restaurantId,
      {
        name,
        rating: rating ? Number(rating) : undefined,
        priceRange,
        deliveryTime,
        location
      },
      { new: true }
    );

    res.json({ success: true, message: "Restaurant updated successfully", data: updated });
  } catch (error) {
    console.error("Update Restaurant Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPopularRestaurants = async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find()
      .sort({ rating: -1, createdAt: -1 })
      .limit(10)
      .lean();

    const restaurantsWithCounts = await Promise.all(
      restaurants.map(async (rest) => {
        const itemCount = await FoodModel.countDocuments({ restaurantId: rest._id });
        return {
          ...rest,
          itemCount
        };
      })
    );

    res.json({ success: true, data: restaurantsWithCounts });
  } catch (error) {
    console.error("Get Popular Restaurants Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};