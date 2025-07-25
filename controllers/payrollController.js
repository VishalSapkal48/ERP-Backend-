const Employee = require("../models/employeeSchema");
const PayrollComponent = require("../models/payrollComponentSchema");

exports.getPayrollComponents = async (req, res) => {
  try {
    console.log(`Fetching payroll data for employeeId: ${req.params.employeeId}`);
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });
    if (!employee) {
      console.log(`Employee not found for ID: ${req.params.employeeId}`);
      return res.status(404).json({ message: "Employee not found" });
    }
    const payrollComponents = await PayrollComponent.find({ employeeId: req.params.employeeId });
    res.json({
      employeeDetails: {
        netSalary: employee.netSalary || 0,
        paymentMethod: employee.paymentMethod || "N/A",
        employeeType: employee.employeeType || "N/A",
        bankName: employee.bankName || "N/A",
        accountTitle: employee.accountTitle || "N/A",
        accountNo: employee.accountNo || "N/A",
        IFSCCode: employee.IFSCCode || "N/A",
        location: employee.location || "N/A",
        designation: employee.designation || "N/A",
        CNIC: employee.CNIC || "N/A",
        name: employee.name || "N/A",
      },
      payrollComponents: payrollComponents || [],
    });
  } catch (error) {
    console.error(`Error in getPayrollComponents: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEmployeesPayroll = async (req, res) => {
  try {
    console.log("Fetching payroll data for all employees");
    const employees = await Employee.find();
    if (!employees || employees.length === 0) {
      console.log("No employees found in the database");
      return res.status(200).json([]);
    }
    const allPayrollData = await Promise.all(
      employees.map(async (employee) => {
        const payrollComponents = await PayrollComponent.find({ employeeId: employee.employeeId });
        return {
          employeeId: employee.employeeId,
          name: employee.name || "N/A",
          employeeDetails: {
            netSalary: employee.netSalary || 0,
            paymentMethod: employee.paymentMethod || "N/A",
            employeeType: employee.employeeType || "N/A",
            bankName: employee.bankName || "N/A",
            accountTitle: employee.accountTitle || "N/A",
            accountNo: employee.accountNo || "N/A",
            IFSCCode: employee.IFSCCode || "N/A",
            location: employee.location || "N/A",
            designation: employee.designation || "N/A",
            CNIC: employee.CNIC || "N/A",
          },
          payrollComponents: payrollComponents || [],
        };
      })
    );
  
    res.status(200).json(allPayrollData);
  } catch (error) {
    console.error(`Error in getAllEmployeesPayroll: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

exports.createPayrollComponent = async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    const { name, status, type, amount } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }
    const newComponent = new PayrollComponent({
      employeeId: req.params.employeeId,
      name,
      status: status || "Active",
      type,
      amount: amount || 0,
    });
    await newComponent.save();
    res.status(201).json(newComponent);
  } catch (error) {
    console.error(`Error in createPayrollComponent: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

exports.updatePayrollComponent = async (req, res) => {
  try {
    const component = await PayrollComponent.findById(req.params.componentId);
    if (!component) return res.status(404).json({ message: "Component not found" });
    if (component.employeeId !== req.params.employeeId) {
      return res.status(403).json({ message: "Component does not belong to this employee" });
    }
    const { name, status, type, amount } = req.body;
    if (name) component.name = name;
    if (status) component.status = status;
    if (type) component.type = type;
    if (amount !== undefined) component.amount = amount;
    await component.save();
    res.json(component);
  } catch (error) {
    console.error(`Error in updatePayrollComponent: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

exports.deletePayrollComponent = async (req, res) => {
  try {
    const component = await PayrollComponent.findById(req.params.componentId);
    if (!component) return res.status(404).json({ message: "Component not found" });
    if (component.employeeId !== req.params.employeeId) {
      return res.status(403).json({ message: "Component does not belong to this employee" });
    }
    await component.deleteOne();
    res.json({ message: "Component deleted successfully" });
  } catch (error) {
    console.error(`Error in deletePayrollComponent: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.id });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const updatedData = req.body;
    Object.keys(updatedData).forEach((key) => {
      if (key !== "employeeId" && updatedData[key] !== undefined) {
        employee[key] = updatedData[key];
      }
    });
    await employee.save();
    res.json(employee);
  } catch (error) {
    console.error(`Error in updateEmployee: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};