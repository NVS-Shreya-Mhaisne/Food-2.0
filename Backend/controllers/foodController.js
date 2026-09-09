import FoodModel from "../models/foodModels.js";
import RestaurantModel from "../models/RestaurantModel.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

export const addFood = async (req, res) => {
  try {
    const { name, description, ingredients, price, category, restaurantId, isTopDish, discount } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "Name, price, and category are required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file.path && req.file.path.startsWith("http")) {
      imageUrl = req.file.path; // Cloudinary URL
      imagePublicId = req.file.filename || req.file.public_id || "";
    } else if (req.file.filename) {
      const host = req.get("host") || "localhost:4000";
      const protocol = req.protocol || "http";
      imageUrl = `${protocol}://${host}/images/${req.file.filename}`;
      imagePublicId = req.file.filename;
    } else if (req.file.path) {
      imageUrl = req.file.path;
    }

    let rName = "";
    let validRestId = null;
    if (restaurantId && restaurantId !== "null" && restaurantId !== "undefined") {
      if (mongoose.Types.ObjectId.isValid(restaurantId)) {
        const rest = await RestaurantModel.findById(restaurantId);
        if (rest) {
          rName = rest.name;
          validRestId = rest._id;
        }
      }
    }

    const newFood = await FoodModel.create({
      name,
      description: description || ingredients || "",
      ingredients: ingredients || description || "",
      price: Number(price),
      category,
      image: imageUrl,
      imagePublicId,
      restaurantId: validRestId,
      restaurantName: rName,
      isTopDish: isTopDish === "true" || isTopDish === true,
      discount: discount ? Number(discount) : 0
    });

    res.status(201).json({ success: true, message: "Food added successfully", food: newFood });
  } catch (error) {
    console.error("Add Food Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listFood = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    let query = {};
    if (restaurantId) {
      query.restaurantId = restaurantId;
    }

    const foods = await FoodModel.find(query)
      .populate('restaurantId', 'name location rating deliveryTime priceRange')
      .sort({ createdAt: -1 })
      .lean();

    const formattedFoods = foods.map(food => {
      const rName = food.restaurantId?.name || food.restaurantName || "Cravely Kitchen";
      const rLocation = food.restaurantId?.location || "";
      return {
        ...food,
        restaurantName: rName,
        restaurantLocation: rLocation
      };
    });

    res.json({ success: true, data: formattedFoods });
  } catch (error) {
    console.error("List Food Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeFood = async (req, res) => {
  try {
    const { foodId } = req.body;

    const food = await FoodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    if (food.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(food.imagePublicId);
      } catch (err) {
        console.error("Cloudinary delete error:", err);
      }
    }

    await FoodModel.findByIdAndDelete(foodId);

    res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.error("Remove Food Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateDiscount = async (req, res) => {
  try {
    const { foodId, discount } = req.body;

    const food = await FoodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    food.discount = Math.max(0, Number(discount) || 0);
    await food.save();

    res.json({
      success: true,
      message: food.discount > 0 ? `Discount of ${food.discount}% applied` : "Discount removed",
      food
    });
  } catch (error) {
    console.error("Update Discount Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { foodId, name, description, ingredients, price, category, restaurantId, isTopDish, discount } = req.body;

    const food = await FoodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (ingredients !== undefined) updateFields.ingredients = ingredients;
    if (price !== undefined) updateFields.price = Number(price);
    if (category !== undefined) updateFields.category = category;
    if (isTopDish !== undefined) updateFields.isTopDish = isTopDish === "true" || isTopDish === true;
    if (discount !== undefined) updateFields.discount = Number(discount);

    if (restaurantId && restaurantId !== "null" && restaurantId !== "undefined") {
      if (mongoose.Types.ObjectId.isValid(restaurantId)) {
        const rest = await RestaurantModel.findById(restaurantId);
        if (rest) {
          updateFields.restaurantId = rest._id;
          updateFields.restaurantName = rest.name;
        }
      }
    }

    if (req.file) {
      let imageUrl = "";
      let imagePublicId = "";
      if (req.file.path && req.file.path.startsWith("http")) {
        imageUrl = req.file.path;
        imagePublicId = req.file.filename || req.file.public_id || "";
      } else if (req.file.filename) {
        const host = req.get("host") || "localhost:5000";
        const protocol = req.protocol || "http";
        imageUrl = `${protocol}://${host}/images/${req.file.filename}`;
        imagePublicId = req.file.filename;
      } else if (req.file.path) {
        imageUrl = req.file.path;
      }
      updateFields.image = imageUrl;
      if (imagePublicId) updateFields.imagePublicId = imagePublicId;

      if (food.imagePublicId && food.imagePublicId !== imagePublicId) {
        try {
          await cloudinary.uploader.destroy(food.imagePublicId);
        } catch (err) {
          console.error("Cloudinary delete old image error:", err);
        }
      }
    }

    const updated = await FoodModel.findByIdAndUpdate(foodId, updateFields, { new: true });

    res.json({ success: true, message: "Food item updated successfully", food: updated });
  } catch (error) {
    console.error("Update Food Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopDishes = async (req, res) => {
  try {
    let foods = await FoodModel.find({ isTopDish: true })
      .populate('restaurantId', 'name location rating deliveryTime priceRange')
      .sort({ createdAt: -1 })
      .lean();

    if (!foods || foods.length === 0) {
      foods = await FoodModel.find({})
        .populate('restaurantId', 'name location rating deliveryTime priceRange')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
    }

    const formattedFoods = foods.map(food => {
      const rName = food.restaurantId?.name || food.restaurantName || "Cravely Kitchen";
      const rLocation = food.restaurantId?.location || "";
      return {
        ...food,
        restaurantName: rName,
        restaurantLocation: rLocation
      };
    });

    res.json({ success: true, data: formattedFoods });
  } catch (error) {
    console.error("Get Top Dishes Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

