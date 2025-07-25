const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Leave Approval', 'General', 'Meeting', 'Other'],
  },
  dueDate: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // Store time as string in "HH:mm" format (e.g., "14:30")
    required: function () {
      return this.type === 'Meeting';
    },
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'], // Added 'completed'
    default: 'pending',
  },
  priority: {
    type: Boolean,
    default: false,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', taskSchema);