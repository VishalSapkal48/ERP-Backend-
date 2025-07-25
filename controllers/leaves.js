// controllers/leaves.js
const Leave = require('../models/leavesSchema');
const Event = require('../models/eventSchema');

exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Event.find({ type: 'Holiday' }).select('name date');
    console.log('Holidays from database:', holidays);
    if (!holidays || holidays.length === 0) {
      return res.status(200).json([]);
    }
    res.json(
      holidays.map((h, index) => ({
        _id: h._id,
        srNo: index + 1,
        occasion: h.name,
        date: h.date,
      }))
    );
  } catch (error) {
    console.error('Error fetching holidays:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching holidays', error: error.message });
  }
};

exports.getLeaveBalances = async (req, res) => {
  try {
    const leaveBalances = [
      { _id: '1', srNo: 1, leaveType: 'Sick Leave', days: 4 },
      { _id: '2', srNo: 2, leaveType: 'Privilege Leave', days: 6 },
    ];
    console.log('Leave balances:', leaveBalances);
    res.json(leaveBalances);
  } catch (error) {
    console.error('Error fetching leave balances:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching leave balances', error: error.message });
  }
};

exports.getLeaveNotes = async (req, res) => {
  try {
    const leaveNotes = [
      'Doctor’s certification required for sick leave exceeding 1 day.',
      'All Privilege Leave cannot be taken at once.',
      'One Privilege Leave can be taken per quarter (2 months).',
      'Privilege Leave not taken will not be carried forward.',
      'Paid Leave is applicable after 6 months from date of joining.',
    ];
    console.log('Leave notes:', leaveNotes);
    res.json(leaveNotes);
  } catch (error) {
    console.error('Error fetching leave notes:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching leave notes', error: error.message });
  }
};

exports.getLeaveRequests = async (req, res) => {
  try {
    const requests = await Leave.find().populate('employeeId', 'name');
    console.log('Leave requests from database:', requests);
    if (!requests || requests.length === 0) {
      return res.status(200).json([]);
    }
    res.json(requests);
  } catch (error) {
    console.error('Error fetching leave requests:', error.message, error.stack);
    res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
  }
};

exports.createLeaveRequest = async (req, res) => {
  try {
    const { from, to, type, reason, employeeId, isHalfDay, halfDayType } = req.body;
    if (!from || !to || !type || !reason || !employeeId) {
      return res.status(400).json({ message: 'From date, to date, type, reason, and employeeId are required' });
    }
    const leave = new Leave({
      employeeId,
      from: new Date(from),
      to: new Date(to),
      type,
      reason,
      isHalfDay,
      halfDayType,
    });
    const savedLeave = await leave.save();
    // Populate employee name in response
    const populatedLeave = await Leave.findById(savedLeave._id).populate('employeeId', 'name');
    console.log('Created leave request:', populatedLeave);
    res.status(201).json(populatedLeave);
  } catch (error) {
    console.error('Error creating leave request:', error.message, error.stack);
    res.status(400).json({ message: 'Error creating leave request', error: error.message });
  }
};

exports.updateLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, type, reason, status, employeeId, isHalfDay, halfDayType } = req.body;
    if (!from || !to || !type || !reason || !employeeId) {
      return res.status(400).json({ message: 'From date, to date, type, reason, and employeeId are required' });
    }
    const leave = await Leave.findByIdAndUpdate(
      id,
      { employeeId, from: new Date(from), to: new Date(to), type, reason, status, isHalfDay, halfDayType },
      { new: true, runValidators: true }
    ).populate('employeeId', 'name');
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    console.log('Updated leave request:', leave);
    res.json(leave);
  } catch (error) {
    console.error('Error updating leave request:', error.message, error.stack);
    res.status(400).json({ message: 'Error updating leave request', error: error.message });
  }
};

exports.deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByIdAndDelete(id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    console.log('Deleted leave request with id:', id);
    res.json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    console.error('Error deleting leave request:', error.message, error.stack);
    res.status(400).json({ message: 'Error deleting leave request', error: error.message });
  }
};