const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// Attendance Routes
// Attendance Routes
router.post('/', attendanceController.createAttendance);
router.get('/', attendanceController.getAttendance);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
module.exports = router;