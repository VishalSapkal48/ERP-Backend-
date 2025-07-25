const mongoose = require("mongoose");

const payrollComponentSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, trim: true }, // Links to Employee.employeeId
  name: { type: String, required: true, trim: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active", trim: true },
  type: { type: String, enum: ["Earning", "Deduction"], required: true, trim: true },
  amount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PayrollComponent", payrollComponentSchema);