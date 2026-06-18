const express = require("express");
const router = express.Router();

const User = require("../Models/User");
const auth = require("../middleware/auth");

// ========================
// ➕ ADD TO CART
// ========================
router.post("/add", auth, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart) user.cart = [];

    const existingItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.log("ADD CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========================
// ➖ DECREASE QUANTITY
// ========================
router.post("/decrease", auth, async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);

    if (!user || !user.cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = user.cart.find(
      (i) => i.productId.toString() === productId
    );

    if (item) {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        user.cart = user.cart.filter(
          (i) => i.productId.toString() !== productId
        );
      }
    }

    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.log("DECREASE CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========================
// ❌ REMOVE ITEM
// ========================
router.post("/remove", auth, async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);

    if (!user || !user.cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    user.cart = user.cart.filter(
      (i) => i.productId.toString() !== productId
    );

    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.log("REMOVE CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ========================
// 📦 GET CART
// ========================
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "cart.productId"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.cart || []);
  } catch (err) {
    console.log("GET CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;