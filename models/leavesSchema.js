// models/leavesSchema.js
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  type: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  isHalfDay: { type: Boolean, default: false },
  halfDayType: { type: String, enum: ['First Half', 'Second Half', null], default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Leave', leaveSchema);