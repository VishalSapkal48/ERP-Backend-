const mongoose = require("mongoose");
const Employee = require("../models/employeeSchema");
const bcrypt = require("bcrypt");

exports.createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;

    const requiredFields = [
      "employeeId",
      "name",
      "department",
      "jobTitle",
      "email",
      "workPhone",
      "homePhone",
      "emergencyPhone",
      "netSalary",
      "paymentMethod",
      "employeeType",
      "username",
      "password",
    ];
    const missingFields = requiredFields.filter((field) => !employeeData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (employeeData.password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    if (req.file) {
      employeeData.profileImage = req.file.buffer.toString("base64");
    } else if (employeeData.profileImage) {
      employeeData.profileImage = employeeData.profileImage;
    } else {
      employeeData.profileImage = "";
    }

    if (!employeeData.pfType) {
      employeeData.employerContributionPf = null;
      employeeData.employeeContributionPf = null;
    }
    if (!employeeData.ssesType) {
      employeeData.employerContributionSses = null;
      employeeData.employeeContributionSses = null;
    }
    if (!employeeData.eobiType) {
      employeeData.employerContributionEobi = null;
      employeeData.employeeContributionEobi = null;
    }
    if (!employeeData.esicType) {
      employeeData.employerContributionEsic = null;
      employeeData.employeeContributionEsic = null;
    }

    employeeData.password = await bcrypt.hash(employeeData.password, 10);
    delete employeeData.reenterPassword;

    const employee = new Employee(employeeData);
    const savedEmployee = await employee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("Error creating employee:", error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({ message: `Duplicate ${field} detected` });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.employeeId }).select("-password");
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employeeData = req.body;

    if (req.file) {
      employeeData.profileImage = req.file.buffer.toString("base64");
    } else if (employeeData.profileImage) {
      employeeData.profileImage = employeeData.profileImage;
    }

    if (!employeeData.pfType) {
      employeeData.employerContributionPf = null;
      employeeData.employeeContributionPf = null;
    }
    if (!employeeData.ssesType) {
      employeeData.employerContributionSses = null;
      employeeData.employeeContributionSses = null;
    }
    if (!employeeData.eobiType) {
      employeeData.employerContributionEobi = null;
      employeeData.employeeContributionEobi = null;
    }
    if (!employeeData.esicType) {
      employeeData.employerContributionEsic = null;
      employeeData.employeeContributionEsic = null;
    }

    if (employeeData.password) {
      if (employeeData.password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }
      employeeData.password = await bcrypt.hash(employeeData.password, 10);
    } else {
      delete employeeData.password;
    }

    delete employeeData.reenterPassword;

    const employee = await Employee.findOneAndUpdate(
      { employeeId: req.params.employeeId },
      { $set: employeeData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error updating employee:", error.message);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      res.status(400).json({ message: `Duplicate ${field} detected` });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({ employeeId: req.params.employeeId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};