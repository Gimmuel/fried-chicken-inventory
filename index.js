const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const MONGO_URI =
  "mongodb://admin:admin@ac-mdnvhc6-shard-00-00.4itwfd1.mongodb.net:27017,ac-mdnvhc6-shard-00-01.4itwfd1.mongodb.net:27017,ac-mdnvhc6-shard-00-02.4itwfd1.mongodb.net:27017/inventoryDB?ssl=true&replicaSet=atlas-xipza9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  supplier: { type: String, required: true },
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

app.get("/api/inventory", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/inventory", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/inventory/:id", async (req, res) => {
  try {
    await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Item updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/inventory/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});