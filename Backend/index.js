const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config(); // Load environment variables
connectDB(); // Establish MongoDB connection

const app = express();

// Enable CORS
app.use(
  cors({
    origin: "https://todo-73mb.vercel.app/", // Allow requests from your frontend
    credentials: true, // Allow cookies if needed
  })
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
