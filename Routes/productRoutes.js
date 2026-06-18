const router = require("express").Router();
const Product = require("../models/Product"); // adjust to your actual path
const auth = require("../middleware/auth");

// GET ALL PRODUCTS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/products called");

    const products = await Product.find();

    return res.status(200).json(products);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
});

// ADD PRODUCT (PROTECTED)
router.post("/", auth, async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;

    const product = await Product.create({
      name,
      price,
      description,
      image,
      category,
      stock,
    });

    return res.status(201).json(product);
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;