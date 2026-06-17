const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Order = require("../models/Order");
const User = require("../models/User");

// ======================
// CREATE ORDER (CHECKOUT)
// ======================
router.post("/checkout", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // build order items
    const items = user.cart.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));

    // calculate total
    const totalAmount = user.cart.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);

    // create order
    const order = await Order.create({
      userId: user._id,
      items,
      totalAmount,
    });

    // clear cart after order
    user.cart = [];
    await user.save();

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// ======================
// GET USER ORDERS
// ======================
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;