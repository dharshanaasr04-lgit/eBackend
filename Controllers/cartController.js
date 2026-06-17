const User = require("../models/User");

// GET CART
exports.getCart = async (req, res) => {
  const user = await User.findById(req.userId).populate("cart.productId");
  res.json(user.cart);
};

// ADD TO CART
exports.addToCart = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.userId);

  const item = user.cart.find(
    (i) => i.productId.toString() === productId
  );

  if (item) item.quantity += 1;
  else user.cart.push({ productId, quantity: 1 });

  await user.save();
  res.json(user.cart);
};

// DECREASE
exports.decreaseQty = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.userId);

  const item = user.cart.find(
    (i) => i.productId.toString() === productId
  );

  if (item) {
    item.quantity--;

    if (item.quantity <= 0) {
      user.cart = user.cart.filter(
        (i) => i.productId.toString() !== productId
      );
    }
  }

  await user.save();
  res.json(user.cart);
};

// REMOVE
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.userId);

  user.cart = user.cart.filter(
    (i) => i.productId.toString() !== productId
  );

  await user.save();
  res.json(user.cart);
};