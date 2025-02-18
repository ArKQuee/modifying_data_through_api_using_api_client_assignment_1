require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const MenuItem = require("./models/MenuItems");

const app = express();
app.use(cors());
app.use(bodyParser.json());


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error(`❌ Error connecting to database: ${error.message}`));


app.post("/menu", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ error: "Name and price are required." });
    }

    const newItem = new MenuItem({ name, description, price });
    await newItem.save();
    res.status(201).json({ message: "Menu item added successfully", newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
