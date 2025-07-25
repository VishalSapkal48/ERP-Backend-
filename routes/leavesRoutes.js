const express = require("express");
const router = express.Router();
const leavesController = require("../controllers/leaves");

router.get("/holidays", leavesController.getHolidays);
router.get("/leave-balances", leavesController.getLeaveBalances);
router.get("/leave-notes", leavesController.getLeaveNotes);
router.get("/requests", leavesController.getLeaveRequests);
router.post("/requests", leavesController.createLeaveRequest);
router.put("/requests/:id", leavesController.updateLeaveRequest);
router.delete("/requests/:id", leavesController.deleteLeaveRequest);

module.exports = router;