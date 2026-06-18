const router = require("express").Router();
const Product = require("../Models/product");
const auth = require("../middleware/auth");

// GET ALL PRODUCTS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    console.log("PRODUCT ROUTE WORKING");

    const products = await Product.find({});

    console.log("PRODUCTS FOUND:", products);

    res.json(products);
  } catch (err) {
    console.log("REAL ERROR IS HERE 👇");
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// ADD PRODUCT (PROTECTED)
router.post("/", auth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to add product" });
  }
});

module.exports = router;