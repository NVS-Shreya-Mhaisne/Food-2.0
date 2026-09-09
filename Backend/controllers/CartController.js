import UserModel from "../models/UserModel.js"

const addToCart = async (req, res) => {
  try {
    console.log("req.body:", req.body); // check what's inside body

    const userId = req.userId;
    const itemId = req.body.itemId;

    if (!userId) return res.json({ success: false, message: "userId missing" });
    if (!itemId) return res.json({ success: false, message: "itemId missing" });

    const userData = await UserModel.findById(userId);
    console.log("userData:", userData);

    if (!userData) return res.json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await UserModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Item added to cart" });

  } catch (error) {
    console.log("CATCH ERROR:", error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    if (!userId) return res.json({ success: false, message: "userId missing" });
    if (!itemId) return res.json({ success: false, message: "itemId missing" });

    const userData = await UserModel.findById(userId);
    if (!userData) return res.json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }

      await UserModel.findByIdAndUpdate(userId, { cartData });
      return res.json({ success: true, message: "Item removed from cart", cartData });
    } else {
      return res.json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.log("REMOVE CART ERROR:", error);
    res.json({ success: false, message: "Error removing item from cart" });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    if (!userId) return res.json({ success: false, message: "userId missing" });
    if (!itemId) return res.json({ success: false, message: "itemId missing" });

    const userData = await UserModel.findById(userId);
    if (!userData) return res.json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};
    if (cartData[itemId]) {
      delete cartData[itemId];
      await UserModel.findByIdAndUpdate(userId, { cartData });
      return res.json({ success: true, message: "Item removed completely from cart", cartData });
    } else {
      return res.json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.log("DELETE CART ERROR:", error);
    res.json({ success: false, message: "Error deleting item from cart" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await UserModel.findById(userId);

    if (!userData) return res.json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.log("GET CART ERROR:", error);
    res.json({ success: false, message: "Error fetching cart data" });
  }
};

const syncCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartData: clientCart } = req.body;

    if (!userId) return res.status(400).json({ success: false, message: "userId missing" });

    const userData = await UserModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    let serverCart = userData.cartData || {};
    let mergedCart = { ...serverCart };

    if (clientCart && typeof clientCart === 'object') {
      for (const [itemId, qty] of Object.entries(clientCart)) {
        const numQty = Number(qty);
        if (!isNaN(numQty) && numQty > 0) {
          // Merge client guest cart with server cart: sum or set client additions
          mergedCart[itemId] = (mergedCart[itemId] || 0) + numQty;
        }
      }
    }

    await UserModel.findByIdAndUpdate(userId, { cartData: mergedCart });
    console.log("Cart synced successfully for user:", userId, "Merged cart:", mergedCart);

    res.json({ success: true, message: "Cart synced successfully", cartData: mergedCart });
  } catch (error) {
    console.error("SYNC CART ERROR:", error);
    res.status(500).json({ success: false, message: "Error syncing cart" });
  }
};

export { addToCart, removeFromCart, deleteFromCart, getCart, syncCart }