const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectToDB = require("./config/connectToDB");

const app = express();
// dotenv config
dotenv.config();
connectToDB();
const PORT = process.env.PORT || 8001;

// middlewares
app.use(express.json());
app.use(cors());

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));

// global error handler (placed after routes)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: err.message || "Something went wrong",
    success: false,
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});