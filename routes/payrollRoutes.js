const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController");

router.get("/:employeeId/payroll-components", payrollController.getPayrollComponents);
router.post("/:employeeId/payroll-components", payrollController.createPayrollComponent);
router.put("/:employeeId/payroll-components/:componentId", payrollController.updatePayrollComponent);

router.get("/all/payroll", payrollController.getAllEmployeesPayroll);

module.exports = router;