import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// Get all users
router.get('/users', adminController.getAllUsers);

// Get user statistics
router.get('/stats', adminController.getUserStats);

// Toggle user active/inactive status
router.put('/users/:userId/toggle-status', adminController.toggleUserStatus);

// Change user role
router.put('/users/:userId/role', adminController.changeUserRole);

export default router;
