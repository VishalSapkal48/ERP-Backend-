const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const eventRoutes = require("./routes/eventRoutes");
const taskRoutes = require("./routes/taskRoutes");
const leavesRoutes = require("./routes/leavesRoutes");
const multer = require("multer");

const connectDB = require("./config/db");

const app = express();

// Configure Multer for file uploads (for employee routes)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 } });

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Connect to MongoDB
connectDB();
// Routes
app.use("/api/employees", upload.single("profileImage"), employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/employees", payrollRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaves", leavesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.message, err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));