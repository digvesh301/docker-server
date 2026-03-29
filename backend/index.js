const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://mongo:27017/testdb")
  .then(() => console.log("Mongo Connected"))
  .catch(err => console.log(err));

// Define a simple model
const UserSchema = new mongoose.Schema({ name: String, email: String });
const User = mongoose.model("User", UserSchema);

// Endpoint accessed via nginx proxy at /apis/...
app.get("/apis/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Seed some initial data for demonstration if DB is empty
app.post("/apis/seed", async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.insertMany([
        { name: "Alice", email: "alice@example.com" },
        { name: "Bob", email: "bob@example.com" }
      ]);
      res.json({ message: "Seed data inserted!" });
    } else {
      res.json({ message: "Data already exists" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to seed data" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello from Docker Compose ");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
