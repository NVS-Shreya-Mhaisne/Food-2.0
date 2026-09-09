import UserModel from "../models/UserModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

const createToken = (id) => {
    console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await UserModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new UserModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}

const getFavorites = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      likedFoods: user.likedFoods || {},
      likedRestaurants: user.likedRestaurants || {}
    });
  } catch (error) {
    console.error("GET FAVORITES ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleLikeFood = async (req, res) => {
  try {
    const userId = req.userId;
    const { foodId } = req.body;
    if (!foodId) {
      return res.status(400).json({ success: false, message: "Food ID is required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const likedFoods = { ...(user.likedFoods || {}) };
    if (likedFoods[foodId]) {
      delete likedFoods[foodId];
    } else {
      likedFoods[foodId] = true;
    }

    await UserModel.findByIdAndUpdate(userId, { likedFoods });
    res.json({ success: true, likedFoods });
  } catch (error) {
    console.error("TOGGLE LIKE FOOD ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleLikeRestaurant = async (req, res) => {
  try {
    const userId = req.userId;
    const { restaurantId } = req.body;
    if (!restaurantId) {
      return res.status(400).json({ success: false, message: "Restaurant ID is required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const likedRestaurants = { ...(user.likedRestaurants || {}) };
    if (likedRestaurants[restaurantId]) {
      delete likedRestaurants[restaurantId];
    } else {
      likedRestaurants[restaurantId] = true;
    }

    await UserModel.findByIdAndUpdate(userId, { likedRestaurants });
    res.json({ success: true, likedRestaurants });
  } catch (error) {
    console.error("TOGGLE LIKE RESTAURANT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        bio: user.bio || "Food enthusiast who loves exploring new restaurants and cuisines. 🍕🍔🍣",
        addresses: user.addresses || [],
        profileImage: user.profileImage || "",
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, bio, addresses, profileImage } = req.body;
    
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (bio !== undefined) updateFields.bio = bio;
    if (addresses !== undefined) updateFields.addresses = addresses;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        bio: user.bio || "",
        addresses: user.addresses || [],
        profileImage: user.profileImage || "",
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { 
  loginUser, 
  registerUser, 
  getFavorites, 
  toggleLikeFood, 
  toggleLikeRestaurant,
  getUserProfile,
  updateUserProfile
};