// // server/routes/question.js
// const express = require('express');
// const router = express.Router();
// const { protect, admin } = require('../middleware/auth');
// const Question = require('../models/Question');
// const User = require('../models/User');

// // @route GET /api/questions
// router.get('/', protect, async (req, res) => {
//   try {
//     const questions = await Question.find();
//     res.json(questions);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route POST /api/questions (Admin only)
// router.delete('/:id', protect, admin, async (req, res) => {
//   try {
//     // 1) Remove the question from the DB
//     const question = await Question.findByIdAndDelete(req.params.id);
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }

//     // 2) Also remove from users' solvedProblems if needed
//     await User.updateMany(
//       { solvedProblems: req.params.id },
//       { $pull: { solvedProblems: req.params.id } }
//     );

//     res.json({ message: 'Question deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Existing routes ...

// // DELETE /api/questions/:id (Admin only)
// router.delete('/:id', protect, admin, async (req, res) => {
//     try {
//       const question = await Question.findByIdAndDelete(req.params.id);
//       if (!question) {
//         return res.status(404).json({ message: 'Question not found' });
//       }
  
//       // Remove this question from all users who have it solved
//       await User.updateMany(
//         { solvedProblems: req.params.id },
//         { $pull: { solvedProblems: req.params.id } }
//       );
  
//       res.json({ message: 'Question deleted successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });

// module.exports = router;




// server/routes/question.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Question = require('../models/Question');
const User = require('../models/User');

/**
 * @route  POST /api/questions
 * @desc   Create a new question (Admin only)
 */
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, link, difficulty, category } = req.body;
    const question = new Question({ name, link, difficulty, category });
    await question.save();
    res.json(question);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route  GET /api/questions
 * @desc   Fetch all questions (Authenticated users)
 */
router.get('/', protect, async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route  DELETE /api/questions/:id
 * @desc   Delete a question (Admin only)
 *         Also removes it from all users' solvedProblems
 */
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Remove this question from all users who solved it
    await User.updateMany(
      { 'solvedProblems.question': req.params.id },
      { $pull: { solvedProblems: { question: req.params.id } } }
    );

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
