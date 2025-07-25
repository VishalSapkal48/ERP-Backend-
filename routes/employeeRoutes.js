const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB limit

router.post('/', upload.single('profileImage'), employeeController.createEmployee);
router.get('/', employeeController.getEmployees);
router.get('/employeeId/:employeeId', employeeController.getEmployeeById);
router.put('/employeeId/:employeeId', upload.single('profileImage'), employeeController.updateEmployee);
router.delete('/employeeId/:employeeId', employeeController.deleteEmployee);

module.exports = router;