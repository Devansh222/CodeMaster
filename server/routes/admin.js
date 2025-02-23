// // server/routes/admin.js
// const express = require('express');
// const router = express.Router();
// const { protect, admin } = require('../middleware/auth');
// const User = require('../models/User');
// const LoginLog = require('../models/LoginLog');


// // GET /api/admin/login-logs
// router.get('/login-logs', protect, admin, async (req, res) => {
//     try {
//       // For example, fetch all login logs
//       const logs = await LoginLog.find().populate('user', 'username email');
//       res.json(logs);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });


// // 1) GET /api/admin/users -> Returns all users
// router.get('/users', protect, admin, async (req, res) => {
//   try {
//     const users = await User.find().select('-password'); // omit password field
//     res.json(users); // returns an array of user documents
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // 2) GET /api/admin/users/:id -> Returns a single user by ID
// router.get('/users/:id', protect, admin, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });




// // PUT /api/admin/users/:id -> Update user
// router.put('/users/:id', protect, admin, async (req, res) => {
//     try {
//       let user = await User.findById(req.params.id);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       const { username, email, role } = req.body;
//       if (username) user.username = username;
//       if (email) user.email = email;
//       if (role) user.role = role;
  
//       await user.save();
//       res.json({ message: 'User updated successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
  
//   // DELETE /api/admin/users/:id -> Delete user
//   router.delete('/users/:id', protect, admin, async (req, res) => {
//     try {
//       const user = await User.findByIdAndDelete(req.params.id);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       res.json({ message: 'User deleted successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });
  






// // Toggle solve/unsolve
// // @route PUT /api/users/solve/:questionId
// router.put('/solve/:questionId', protect, async (req, res) => {
//   try {
//     const user = req.user;
//     const questionId = req.params.questionId;

//     // If question is already solved, remove it (unsolve)
//     if (user.solvedProblems.includes(questionId)) {
//       user.solvedProblems = user.solvedProblems.filter(
//         (id) => id.toString() !== questionId
//       );
//     } else {
//       // Otherwise, add it (solve)
//       user.solvedProblems.push(questionId);
//     }

//     await user.save();
//     res.json({ solvedProblems: user.solvedProblems });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route GET /api/users/progress
// // Returns count of solved questions per difficulty.
// router.get('/progress', protect, async (req, res) => {
//   try {
//     await req.user.populate('solvedProblems');
//     const progress = { easy: 0, medium: 0, hard: 0 };
//     req.user.solvedProblems.forEach((q) => {
//       progress[q.difficulty]++;
//     });
//     res.json(progress);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;






// server/routes/admin.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const User = require('../models/User');
const LoginLog = require('../models/LoginLog');

/**
 * @route  GET /api/admin/login-logs
 * @desc   Returns all login logs with user info
 */
router.get('/login-logs', protect, admin, async (req, res) => {
  try {
    const logs = await LoginLog.find().populate('user', 'username email');
    res.json(logs);
  } catch (error) {
    console.error('Error fetching login logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route  GET /api/admin/users
 * @desc   Returns all users (no passwords)
 */
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route  GET /api/admin/users/:id
 * @desc   Returns a single user by ID (no password)
 */
router.get('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route  PUT /api/admin/users/:id
 * @desc   Updates a user’s username, email, or role
 */
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const { username, email, role } = req.body;
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    
    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route  DELETE /api/admin/users/:id
 * @desc   Deletes a user by ID
 */
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
