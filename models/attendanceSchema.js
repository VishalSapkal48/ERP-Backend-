const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    checkIn: {
      type: String,
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid check-in time format (HH:mm)"],
    },
    checkOut: {
      type: String,
      match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid check-out time format (HH:mm)"],
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "leave"],
      default: "present",
    },
    workHours: {
      type: Number,
      min: [0, "Work hours cannot be negative"],
    },
  },
  { timestamps: true }
);

// Ensure unique attendance record per employee and date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);