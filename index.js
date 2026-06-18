const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cartRoutes = require("./Routes/cartRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app"
    ],
    credentials: true,
  })
);

//version update

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Amazon-style API running");
});

// Routes
app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/products", require("./Routes/productRoutes"));
app.use("/api/orders", require("./Routes/orderRoutes"));
app.use("/api/cart", cartRoutes);
app.use("/api/admin", require("./Routes/adminRoutes"));

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Server running on", PORT);
  });
}

module.exports = app;