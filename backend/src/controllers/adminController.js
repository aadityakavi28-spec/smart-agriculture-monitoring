import User from '../models/User.js';

// Get all users with their activity data
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      loginCount: user.loginCount,
      lastActivity: user.lastActivity,
      createdAt: user.createdAt,
      status: user.isActive ? (user.lastLogin ? 'Active' : 'Registered') : 'Inactive',
    }));

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: {
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.isActive).length,
        inactiveUsers: users.filter((u) => !u.isActive).length,
        users: formattedUsers,
      },
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// Get user activity statistics
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    // Get users who logged in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const loginsToday = await User.countDocuments({
      lastLogin: { $gte: today },
    });

    // Get users who were active in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeLastWeek = await User.countDocuments({
      lastActivity: { $gte: sevenDaysAgo },
    });

    // Get total login count across all users
    const users = await User.find({});
    const totalLogins = users.reduce((sum, user) => sum + (user.loginCount || 0), 0);
    const avgLogins = totalUsers > 0 ? (totalLogins / totalUsers).toFixed(2) : 0;

    return res.status(200).json({
      success: true,
      message: 'Statistics fetched successfully',
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        loginsToday,
        activeLastWeek,
        totalLogins,
        avgLogins,
      },
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};

// Toggle user active status
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('Toggle User Status Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle user status',
      error: error.message,
    });
  }
};

// Change user role
const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Change User Role Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change user role',
      error: error.message,
    });
  }
};

export default {
  getAllUsers,
  getUserStats,
  toggleUserStatus,
  changeUserRole,
};
