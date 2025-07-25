const mongoose = require('mongoose');
const Attendance = require('../models/attendanceSchema');

// exports.createAttendance = async (req, res) => {
//   try {
//     const { employeeId, checkIn, checkOut, date, status } = req.body;

//     // Validate required fields
//     if (!mongoose.Types.ObjectId.isValid(employeeId)) {
//       return res.status(400).json({ message: 'Invalid employee ID' });
//     }
//     if (!date) {
//       return res.status(400).json({ message: 'Date is required' });
//     }

//     // Validate date is not in the future
//     const inputDate = new Date(date);
//     inputDate.setUTCHours(0, 0, 0, 0);
//     const today = new Date();
//     today.setUTCHours(0, 0, 0, 0);
//     if (inputDate > today) {
//       return res.status(400).json({ message: 'Date cannot be in the future' });
//     }

//     // Calculate work hours for 'present' status
//     let workHours;
//     if (status === 'present') {
//       if (!checkIn || !checkOut) {
//         return res.status(400).json({ message: 'Check-in and check-out times are required for present status' });
//       }
//       const checkInTime = new Date(`1970-01-01T${checkIn}:00Z`);
//       const checkOutTime = new Date(`1970-01-01T${checkOut}:00Z`);
//       if (checkOutTime <= checkInTime) {
//         return res.status(400).json({ message: 'Check-out time must be after check-in time' });
//       }
//       workHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
//       workHours = Number(workHours.toFixed(2));
//     } else {
//       checkIn = undefined;
//       checkOut = undefined;
//       workHours = undefined;
//     }

//     // Create attendance document
//     const attendance = new Attendance({
//       employeeId,
//       checkIn,
//       checkOut,
//       date: inputDate,
//       status: status || 'present',
//       workHours,
//     });

//     const savedAttendance = await attendance.save();
//     const populatedAttendance = await Attendance.findById(savedAttendance._id).populate(
//       'employeeId',
//       'name department jobTitle'
//     );
//     res.status(201).json(populatedAttendance);
//   } catch (error) {
//     console.error('Error in createAttendance:', error, 'Input:', req.body);
//     if (error.code === 11000) {
//       res.status(400).json({ message: 'Attendance record already exists for this employee on this date' });
//     } else {
//       res.status(400).json({ message: error.message || 'Failed to create attendance record' });
//     }
//   }
// };


exports.createAttendance = async (req, res) => {
  try {
    const { employeeId, checkIn, checkOut, date, status } = req.body;

    // Validate required fields
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Validate date is not in the future
    const inputDate = new Date(date);
    inputDate.setUTCHours(0, 0, 0, 0);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (inputDate > today) {
      return res.status(400).json({ message: 'Date cannot be in the future' });
    }

    // Prepare attendance data
    let attendanceData = {
      employeeId,
      date: inputDate,
      status: status || 'present',
    };

    // Add checkIn, checkOut, and workHours only for 'present' status
    if (status === 'present') {
      if (!checkIn || !checkOut) {
        return res.status(400).json({ message: 'Check-in and check-out times are required for present status' });
      }
      const checkInTime = new Date(`1970-01-01T${checkIn}:00Z`);
      const checkOutTime = new Date(`1970-01-01T${checkOut}:00Z`);
      if (checkOutTime <= checkInTime) {
        return res.status(400).json({ message: 'Check-out time must be after check-in time' });
      }
      const workHours = Number(((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2));
      attendanceData = { ...attendanceData, checkIn, checkOut, workHours };
    }

    // Create attendance document
    const attendance = new Attendance(attendanceData);
    const savedAttendance = await attendance.save();
    const populatedAttendance = await Attendance.findById(savedAttendance._id).populate(
      'employeeId',
      'name department jobTitle'
    );
    res.status(201).json(populatedAttendance);
  } catch (error) {
    console.error('Error in createAttendance:', error, 'Input:', req.body);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Attendance record already exists for this employee on this date' });
    } else {
      res.status(400).json({ message: error.message || 'Failed to create attendance record' });
    }
  }
};
exports.getAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    if (startDate && endDate) {
      query = {
        date: {
          $gte: new Date(startDate + 'T00:00:00Z'),
          $lte: new Date(endDate + 'T00:00:00Z'),
        },
      };
    }
    const attendance = await Attendance.find(query).populate('employeeId', 'name department jobTitle');
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error in getAttendance:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch attendance records' });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid attendance ID' });
    }

    // Prepare update object
    let updateData = { status };
    if (status === 'present') {
      if (!checkIn || !checkOut) {
        return res.status(400).json({ message: 'Check-in and check-out times are required for present status' });
      }
      const checkInTime = new Date(`1970-01-01T${checkIn}:00Z`);
      const checkOutTime = new Date(`1970-01-01T${checkOut}:00Z`);
      if (checkOutTime <= checkInTime) {
        return res.status(400).json({ message: 'Check-out time must be after check-in time' });
      }
      const workHours = Number(((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2));
      updateData = { ...updateData, checkIn, checkOut, workHours };
    } else {
      updateData = { ...updateData, checkIn: undefined, checkOut: undefined, workHours: undefined };
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('employeeId', 'name department jobTitle');

    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error('Error in updateAttendance:', error);
    res.status(400).json({ message: error.message || 'Failed to update attendance record' });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid attendance ID' });
    }

    const deletedAttendance = await Attendance.findByIdAndDelete(id);

    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAttendance:', error);
    res.status(400).json({ message: error.message || 'Failed to delete attendance record' });
  }
};