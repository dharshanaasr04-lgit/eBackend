const User = require("../models/User");
const Order = require("../models/Order");

// PLACE ORDER
exports.checkout = async (req, res) => {
  const user = await User.findById(req.userId).populate("cart.productId");

  if (user.cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const total = user.cart.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity;
  }, 0);

  const order = await Order.create({
    userId: req.userId,
    items: user.cart,
    total,
  });

  user.cart = [];
  await user.save();

  res.json(order);
};

// GET MY ORDERS
exports.myOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.userId });
  res.json(orders);
};