const Product = require("../Models/product");
const Order = require("../Models/Order");

exports.getStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();

   const totalRevenue = orders.reduce(
  (sum, order) => sum + (order.totalAmount || 0),
  0
);

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};