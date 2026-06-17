const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cartRoutes = require("./routes/cartRoutes");
dotenv.config();

const app = express();

const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));

// Routes

// Health check
app.get("/", (req, res) => {
  res.send("Amazon-style API running");
});

// DB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://dharshana:dharshana@ac-mvp7ebm-shard-00-00.sj4ak4j.mongodb.net:27017,ac-mvp7ebm-shard-00-01.sj4ak4j.mongodb.net:27017,ac-mvp7ebm-shard-00-02.sj4ak4j.mongodb.net:27017/?ssl=true&replicaSet=atlas-hg4y9f-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", cartRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));
