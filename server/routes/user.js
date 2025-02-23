// // // server/routes/user.js
// // const express = require('express');
// // const router = express.Router();
// // const { protect } = require('../middleware/auth');
// // const User = require('../models/User');



// // // GET /api/users/solved -> returns array of solved question IDs
// // router.get('/solved', protect, async (req, res) => {
// //     try {
// //       // req.user is populated by the protect middleware
// //       res.json(req.user.solvedProblems);
// //     } catch (error) {
// //       res.status(500).json({ message: 'Server error' });
// //     }
// //   });
  


// // // Toggle solve/unsolve
// // // @route PUT /api/users/solve/:questionId
// // router.put('/solve/:questionId', protect, async (req, res) => {
// //   try {
// //     const user = req.user;
// //     const questionId = req.params.questionId;

// //     // If question is already solved, remove it (unsolve)
// //     if (user.solvedProblems.includes(questionId)) {
// //       user.solvedProblems = user.solvedProblems.filter(
// //         (id) => id.toString() !== questionId
// //       );
// //     } else {
// //       // Otherwise, add it (solve)
// //       user.solvedProblems.push(questionId);
// //     }

// //     await user.save();
// //     res.json({ solvedProblems: user.solvedProblems });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // // @route GET /api/users/progress
// // // Returns count of solved questions per difficulty.
// // router.get('/progress', protect, async (req, res) => {
// //   try {
// //     await req.user.populate('solvedProblems');
// //     const progress = { easy: 0, medium: 0, hard: 0 };
// //     req.user.solvedProblems.forEach((q) => {
// //       progress[q.difficulty]++;
// //     });
// //     res.json(progress);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // module.exports = router;



// // server/routes/user.js
// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const User = require('../models/User');
// const Question = require('../models/Question');

// // GET /api/users/solved -> returns array of solved problems (as objects)
// router.get('/solved', protect, async (req, res) => {
//   try {
//     await req.user.populate('solvedProblems.question');
//     res.json(req.user.solvedProblems);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // PUT /api/users/solve/:questionId -> Mark a question as solved (one-way)
// router.put('/solve/:questionId', protect, async (req, res) => {
//   try {
//     const user = req.user;
//     const questionId = req.params.questionId;

//     // Prevent unsolving: if already solved, return error.
//     const alreadySolved = user.solvedProblems.find(item => item.question.toString() === questionId);
//     if (alreadySolved) {
//       return res.status(400).json({ message: 'Question already solved' });
//     }

//     // Check if question exists
//     const question = await Question.findById(questionId);
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }

//     // Add the solved problem record
//     const solvedProblem = { question: questionId, solvedAt: new Date(), notes: '' };
//     user.solvedProblems.push(solvedProblem);
//     await user.save();
//     res.json({ solvedProblem });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // PUT /api/users/notes/:questionId -> Update notes for a solved question
// router.put('/notes/:questionId', protect, async (req, res) => {
//   try {
//     const { notes } = req.body;
//     const questionId = req.params.questionId;
//     const user = req.user;

//     const solvedRecord = user.solvedProblems.find(item => item.question.toString() === questionId);
//     if (!solvedRecord) {
//       return res.status(400).json({ message: 'Question not solved yet' });
//     }
//     solvedRecord.notes = notes;
//     await user.save();
//     res.json({ message: 'Notes updated', solvedRecord });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // GET /api/users/progress -> Returns count of solved questions per difficulty.
// router.get('/progress', protect, async (req, res) => {
//   try {
//     await req.user.populate('solvedProblems.question');
//     const progress = { easy: 0, medium: 0, hard: 0 };
//     req.user.solvedProblems.forEach(solved => {
//       if (solved.question && solved.question.difficulty) {
//         progress[solved.question.difficulty]++;
//       }
//     });
//     res.json(progress);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // GET /api/users/activity -> Returns array of { date: 'YYYY-MM-DD', count: X }
// router.get('/activity', protect, async (req, res) => {
//   try {
//     await req.user.populate('solvedProblems');
//     const activityMap = {};
//     req.user.solvedProblems.forEach(solved => {
//       const dateStr = solved.solvedAt.toISOString().split('T')[0];
//       activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
//     });
//     const activity = Object.keys(activityMap).map(date => ({ date, count: activityMap[date] }));
//     res.json(activity);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // GET /api/users/summary -> Returns user's about and skills
// router.get('/summary', protect, async (req, res) => {
//   try {
//     res.json({ about: req.user.about, skills: req.user.skills });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;












// server/routes/user.js
// const express = require('express');
// const mongoose = require('mongoose');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const User = require('../models/User');
// const Question = require('../models/Question');

// /**
//  * @route  GET /api/users/solved
//  * @desc   Returns array of solved problems (populated with question data)
//  *         Each item looks like: { question, solvedAt, notes }
//  */
// router.get('/solved', protect, async (req, res) => {
//   try {
//     // Populate the question details in each subdoc
//     await req.user.populate('solvedProblems.question');
//     // Return the array of subdocs
//     res.json(req.user.solvedProblems);
//   } catch (error) {
//     console.error('Error fetching solved problems:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * @route  PUT /api/users/solve/:questionId
//  * @desc   Mark a question as solved (one-way). 
//  *         Returns { solvedProblem } in the same shape as the subdoc.
//  */
// router.put('/solve/:questionId', protect, async (req, res) => {
//   try {
//     const user = req.user;
//     const questionId = req.params.questionId;

//     // 1) Validate questionId is a proper ObjectId
//     if (!mongoose.Types.ObjectId.isValid(questionId)) {
//       return res.status(400).json({ message: 'Invalid question ID' });
//     }

//     // 2) Check if user already solved it
//     const alreadySolved = user.solvedProblems.find(
//       (item) => item.question.toString() === questionId
//     );
//     if (alreadySolved) {
//       return res.status(400).json({ message: 'Question already solved' });
//     }

//     // 3) Ensure the question exists
//     const question = await Question.findById(questionId);
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }

//     // 4) Create a new solved subdoc
//     const solvedProblem = {
//       question: questionId,
//       solvedAt: new Date(),
//       notes: ''
//     };
//     user.solvedProblems.push(solvedProblem);
//     await user.save();

//     // Return { solvedProblem } to match what the frontend expects
//     res.json({ solvedProblem });
//   } catch (error) {
//     console.error('Error marking question as solved:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * @route  PUT /api/users/notes/:questionId
//  * @desc   Update the notes for a solved question subdoc
//  */
// router.put('/notes/:questionId', protect, async (req, res) => {
//   try {
//     const { notes } = req.body;
//     const questionId = req.params.questionId;
//     const user = req.user;

//     if (!mongoose.Types.ObjectId.isValid(questionId)) {
//       return res.status(400).json({ message: 'Invalid question ID' });
//     }

//     // Find the subdoc
//     const solvedRecord = user.solvedProblems.find(
//       (item) => item.question.toString() === questionId
//     );
//     if (!solvedRecord) {
//       return res.status(400).json({ message: 'Question not solved yet' });
//     }

//     solvedRecord.notes = notes;
//     await user.save();

//     res.json({ message: 'Notes updated', solvedRecord });
//   } catch (error) {
//     console.error('Error updating notes:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * @route  GET /api/users/progress
//  * @desc   Returns count of solved questions per difficulty
//  */
// router.get('/progress', protect, async (req, res) => {
//   try {
//     await req.user.populate('solvedProblems.question');
//     const progress = { easy: 0, medium: 0, hard: 0 };

//     req.user.solvedProblems.forEach((sp) => {
//       if (sp.question && sp.question.difficulty) {
//         progress[sp.question.difficulty]++;
//       }
//     });
//     res.json(progress);
//   } catch (error) {
//     console.error('Error calculating progress:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * @route  GET /api/users/activity
//  * @desc   Returns daily solve counts if you're storing solvedAt
//  */
// router.get('/activity', protect, async (req, res) => {
//   try {
//     await req.user.populate('solvedProblems');
//     const activityMap = {};

//     req.user.solvedProblems.forEach((sp) => {
//       const dateStr = sp.solvedAt.toISOString().split('T')[0];
//       activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
//     });

//     const activity = Object.keys(activityMap).map((date) => ({
//       date,
//       count: activityMap[date]
//     }));

//     res.json(activity);
//   } catch (error) {
//     console.error('Error fetching activity:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * @route  GET /api/users/summary
//  * @desc   Returns the user's about/skills for the dashboard
//  */
// router.get('/summary', protect, async (req, res) => {
//   try {
//     res.json({
//       about:  req.user.about,
//       skills: req.user.skills
//     });
//   } catch (error) {
//     console.error('Error fetching summary:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;








// server/routes/user.js
// const express = require('express');
// const mongoose = require('mongoose');
// const router = express.Router();
// const { protect } = require('../middleware/auth');
// const User = require('../models/User');
// const Question = require('../models/Question');

// /**
//  * GET /api/users/solved
//  * Returns array of solved problems, each subdoc has { question, solvedAt, notes }
//  */
// router.get('/solved', protect, async (req, res) => {
//   try {
//     // Filter out any malformed subdocs missing question
//     req.user.solvedProblems = req.user.solvedProblems.filter(sp => sp.question);
//     await req.user.save();

//     // Populate the question details
//     await req.user.populate('solvedProblems.question');
//     res.json(req.user.solvedProblems);
//   } catch (error) {
//     console.error('Error fetching solved problems:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * PUT /api/users/solve/:questionId
//  * Marks a question as solved (one-way), returns { solvedProblem }
//  */
// router.put('/solve/:questionId', protect, async (req, res) => {
//   try {
//     const user = req.user;
//     const questionId = req.params.questionId;

//     // 1) Validate ID
//     if (!mongoose.Types.ObjectId.isValid(questionId)) {
//       return res.status(400).json({ message: 'Invalid question ID' });
//     }

//     // 2) Clean up any malformed subdocs missing question
//     user.solvedProblems = user.solvedProblems.filter(sp => sp.question);
//     await user.save();

//     // 3) Check if already solved
//     const alreadySolved = user.solvedProblems.find(
//       (item) => item.question && item.question.toString() === questionId
//     );
//     if (alreadySolved) {
//       return res.status(400).json({ message: 'Question already solved' });
//     }

//     // 4) Ensure question exists
//     const question = await Question.findById(questionId);
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }

//     // 5) Add the subdoc
//     const solvedProblem = {
//       question: questionId,
//       solvedAt: new Date(),
//       notes: ''
//     };
//     user.solvedProblems.push(solvedProblem);
//     await user.save();

//     return res.json({ solvedProblem });
//   } catch (error) {
//     console.error('Error marking question as solved:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * PUT /api/users/notes/:questionId
//  * Updates notes for a solved question subdoc
//  */
// router.put('/notes/:questionId', protect, async (req, res) => {
//   try {
//     const { notes } = req.body;
//     const questionId = req.params.questionId;
//     const user = req.user;

//     if (!mongoose.Types.ObjectId.isValid(questionId)) {
//       return res.status(400).json({ message: 'Invalid question ID' });
//     }

//     // Clean up any malformed subdocs
//     user.solvedProblems = user.solvedProblems.filter(sp => sp.question);
//     await user.save();

//     // Find the subdoc
//     const solvedRecord = user.solvedProblems.find(
//       (item) => item.question && item.question.toString() === questionId
//     );
//     if (!solvedRecord) {
//       return res.status(400).json({ message: 'Question not solved yet' });
//     }

//     solvedRecord.notes = notes;
//     await user.save();

//     res.json({ message: 'Notes updated', solvedRecord });
//   } catch (error) {
//     console.error('Error updating notes:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * GET /api/users/progress
//  * Returns count of solved questions by difficulty
//  */
// router.get('/progress', protect, async (req, res) => {
//   try {
//     await req.user.populate('solvedProblems.question');
//     const progress = { easy: 0, medium: 0, hard: 0 };

//     req.user.solvedProblems.forEach(sp => {
//       if (sp.question && sp.question.difficulty) {
//         progress[sp.question.difficulty]++;
//       }
//     });
//     res.json(progress);
//   } catch (error) {
//     console.error('Error calculating progress:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * GET /api/users/activity
//  * Returns daily counts if storing solvedAt
//  */
// router.get('/activity', protect, async (req, res) => {
//   try {
//     await req.user.populate('solvedProblems');
//     const activityMap = {};

//     req.user.solvedProblems.forEach(sp => {
//       if (!sp.solvedAt) return;
//       const dateStr = sp.solvedAt.toISOString().split('T')[0];
//       activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
//     });

//     const activity = Object.keys(activityMap).map(date => ({
//       date,
//       count: activityMap[date]
//     }));

//     res.json(activity);
//   } catch (error) {
//     console.error('Error fetching activity:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * GET /api/users/summary
//  * Returns user's about/skills for the dashboard
//  */
// router.get('/summary', protect, async (req, res) => {
//   try {
//     res.json({
//       about:  req.user.about,
//       skills: req.user.skills
//     });
//   } catch (error) {
//     console.error('Error fetching summary:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;










// // server/routes/user.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Question = require('../models/Question');
// const { protect } = require('../middleware/auth');

// // GET /api/users/solved -> returns user.solved array
// router.get('/solved', protect, async (req, res) => {
//   try {
//     // Return the user's solved array
//     // Each item is { questionId: string, notes: string }
//     res.json(req.user.solved);
//   } catch (error) {
//     console.error('Error fetching solved:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // PUT /api/users/solve/:questionId -> marks a question as solved
// router.put('/solve/:questionId', protect, async (req, res) => {
//   try {
//     const user = req.user;
//     const questionId = req.params.questionId; // a string

//     // Optional: check if the question doc exists
//     const question = await Question.findById(questionId);
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }

//     // Check if user already solved this question
//     const existing = user.solved.find(item => item.questionId === questionId);
//     if (existing) {
//       return res.status(400).json({ message: 'Question already solved' });
//     }

//     // Otherwise, add a new subdoc
//     user.solved.push({ questionId, notes: '' });
//     await user.save();

//     // Return the newly added subdoc
//     const newSubdoc = user.solved.find(item => item.questionId === questionId);
//     res.json({ solvedProblem: newSubdoc });
//   } catch (error) {
//     console.error('Error marking question as solved:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // PUT /api/users/notes/:questionId -> updates notes for that question
// router.put('/notes/:questionId', protect, async (req, res) => {
//   try {
//     const user = req.user;
//     const questionId = req.params.questionId;
//     const { notes } = req.body;

//     // Check if user has solved or created a subdoc for this question
//     const subdoc = user.solved.find(item => item.questionId === questionId);
//     if (!subdoc) {
//       return res.status(400).json({ message: 'Question not solved yet' });
//     }

//     subdoc.notes = notes;
//     await user.save();

//     res.json({ message: 'Notes updated', solvedRecord: subdoc });
//   } catch (error) {
//     console.error('Error updating notes:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });




// /**
//  * GET /api/users/progress
//  * Returns counts of solved questions per difficulty (only those with solvedAt != null)
//  */
// router.get('/progress', protect, async (req, res) => {
//   try {
//     await req.user.populate('solvedProblems.question');
//     const progress = { easy: 0, medium: 0, hard: 0 };

//     req.user.solvedProblems.forEach(sp => {
//       if (sp.solvedAt && sp.question && sp.question.difficulty) {
//         progress[sp.question.difficulty]++;
//       }
//     });
//     res.json(progress);
//   } catch (error) {
//     console.error('Error calculating progress:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * GET /api/users/activity
//  * Returns daily counts of solved questions for a heatmap
//  */
// router.get('/activity', protect, async (req, res) => {
//   try {
//     await req.user.populate('solvedProblems');
//     const activityMap = {};
//     req.user.solvedProblems.forEach(sp => {
//       if (sp.solvedAt) {
//         const dateStr = sp.solvedAt.toISOString().split('T')[0];
//         activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
//       }
//     });
//     const activity = Object.keys(activityMap).map(date => ({
//       date,
//       count: activityMap[date]
//     }));
//     res.json(activity);
//   } catch (error) {
//     console.error('Error fetching activity:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * GET /api/users/summary
//  * Returns user's about/skills for dashboard
//  */
// router.get('/summary', protect, async (req, res) => {
//   try {
//     res.json({
//       about: req.user.about,
//       skills: req.user.skills
//     });
//   } catch (error) {
//     console.error('Error fetching summary:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;








// // server/routes/user.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Question = require('../models/Question');
// const { protect } = require('../middleware/auth');

// /**
//  * GET /api/users/solved
//  * Returns user.solved array (each item has { questionId, solvedAt, notes })
//  */
// router.get('/solved', protect, async (req, res) => {
//   try {
//     // Return the user's solved array directly
//     // e.g. [ { questionId: '63f9...', solvedAt: '2023-02-28T...', notes: '...' }, ... ]
//     res.json(req.user.solved);
//   } catch (error) {
//     console.error('Error fetching solved:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * PUT /api/users/solve/:questionId
//  * Marks a question as solved by adding a subdoc { questionId, solvedAt, notes }
//  */
// router.put('/solve/:questionId', protect, async (req, res) => {
//   try {
//     const user = req.user;
//     const questionId = req.params.questionId; // a string

//     // Optional: check if the question doc actually exists
//     const question = await Question.findById(questionId);
//     if (!question) {
//       return res.status(404).json({ message: 'Question not found' });
//     }

//     // Check if user already solved this question
//     const existing = user.solved.find(item => item.questionId === questionId);
//     if (existing) {
//       return res.status(400).json({ message: 'Question already solved' });
//     }

//     // Otherwise, push a new subdoc
//     user.solved.push({ questionId, solvedAt: new Date(), notes: '' });
//     await user.save();

//     // Return the newly added subdoc
//     const newSubdoc = user.solved.find(item => item.questionId === questionId);
//     res.json({ solvedProblem: newSubdoc });
//   } catch (error) {
//     console.error('Error marking question as solved:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * PUT /api/users/notes/:questionId
//  * Updates the notes for that question
//  */
// router.put('/notes/:questionId', protect, async (req, res) => {
//   try {
//     const user = req.user;
//     const questionId = req.params.questionId;
//     const { notes } = req.body;

//     // Check if user has subdoc for this question
//     const subdoc = user.solved.find(item => item.questionId === questionId);
//     if (!subdoc) {
//       return res.status(400).json({ message: 'Question not solved yet' });
//     }

//     subdoc.notes = notes;
//     await user.save();

//     res.json({ message: 'Notes updated', solvedRecord: subdoc });
//   } catch (error) {
//     console.error('Error updating notes:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * GET /api/users/progress
//  * Returns count of solved questions per difficulty
//  */
// router.get('/progress', protect, async (req, res) => {
//   try {
//     // user.solved is an array of { questionId, solvedAt, notes }
//     // We'll find the question docs for each questionId
//     const questionIds = req.user.solved.map(s => s.questionId);
//     // fetch them from the question collection
//     const questions = await Question.find({ _id: { $in: questionIds } });
//     const progress = { easy: 0, medium: 0, hard: 0 };

//     // For each question doc, increment the difficulty
//     for (const q of questions) {
//       if (q.difficulty === 'easy') progress.easy++;
//       else if (q.difficulty === 'medium') progress.medium++;
//       else if (q.difficulty === 'hard') progress.hard++;
//     }

//     res.json(progress);
//   } catch (error) {
//     console.error('Error calculating progress:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * GET /api/users/activity
//  * Returns daily counts for a heatmap (based on solvedAt in user.solved)
//  */
// router.get('/activity', protect, async (req, res) => {
//   try {
//     const activityMap = {};

//     // Each subdoc has { questionId, solvedAt, notes }
//     // If solvedAt exists, increment that day
//     for (const subdoc of req.user.solved) {
//       if (subdoc.solvedAt) {
//         const dateStr = subdoc.solvedAt.toISOString().split('T')[0];
//         activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
//       }
//     }

//     // Convert to an array for the heatmap
//     const activity = Object.keys(activityMap).map(date => ({
//       date,
//       count: activityMap[date]
//     }));

//     res.json(activity);
//   } catch (error) {
//     console.error('Error fetching activity:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// /**
//  * GET /api/users/summary
//  * Returns user's about/skills
//  */
// router.get('/summary', protect, async (req, res) => {
//   try {
//     res.json({
//       about: req.user.about,
//       skills: req.user.skills
//     });
//   } catch (error) {
//     console.error('Error fetching summary:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;









// server/routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question');
const { protect } = require('../middleware/auth');

/**
 * GET /api/users/solved
 * Returns user.solved array
 */
router.get('/solved', protect, async (req, res) => {
  try {
    res.json(req.user.solved);
  } catch (error) {
    console.error('Error fetching solved:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/users/solve/:questionId
 * Mark a question as solved => { questionId, solvedAt, notes: "" }
 */
router.put('/solve/:questionId', protect, async (req, res) => {
  try {
    const user = req.user;
    const questionId = req.params.questionId;

    // Optional: ensure the question doc actually exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if already solved
    const existing = user.solved.find(item => item.questionId === questionId);
    if (existing) {
      return res.status(400).json({ message: 'Question already solved' });
    }

    // Otherwise, add subdoc
    user.solved.push({ questionId, solvedAt: new Date(), notes: '' });
    await user.save();

    const newSubdoc = user.solved.find(item => item.questionId === questionId);
    res.json({ solvedProblem: newSubdoc });
  } catch (error) {
    console.error('Error marking question as solved:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/users/notes/:questionId
 * Update notes for that question
 */
router.put('/notes/:questionId', protect, async (req, res) => {
  try {
    const user = req.user;
    const questionId = req.params.questionId;
    const { notes } = req.body;

    const subdoc = user.solved.find(item => item.questionId === questionId);
    if (!subdoc) {
      return res.status(400).json({ message: 'Question not solved yet' });
    }

    subdoc.notes = notes;
    await user.save();

    res.json({ message: 'Notes updated', solvedRecord: subdoc });
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/users/progress
 * Return count of solved questions per difficulty
 */
router.get('/progress', protect, async (req, res) => {
  try {
    // user.solved => array of { questionId, solvedAt, notes }
    const questionIds = req.user.solved.map(s => s.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    const progress = { easy: 0, medium: 0, hard: 0 };
    for (const q of questions) {
      if (q.difficulty === 'easy') progress.easy++;
      else if (q.difficulty === 'medium') progress.medium++;
      else if (q.difficulty === 'hard') progress.hard++;
    }

    res.json(progress);
  } catch (error) {
    console.error('Error calculating progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/users/activity
 * Return daily counts from solvedAt
 */
router.get('/activity', protect, async (req, res) => {
  try {
    const activityMap = {};

    // user.solved => { questionId, solvedAt, notes }
    for (const subdoc of req.user.solved) {
      if (subdoc.solvedAt) {
        const dateStr = subdoc.solvedAt.toISOString().split('T')[0];
        activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
      }
    }

    const activity = Object.keys(activityMap).map(date => ({
      date,
      count: activityMap[date]
    }));

    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/users/summary
 */
router.get('/summary', protect, async (req, res) => {
  try {
    res.json({
      about: req.user.about,
      skills: req.user.skills
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * PUT /api/users/summary
 * Updates user's about and skills.
 */
router.put('/summary', protect, async (req, res) => {
  try {
    const { about, skills } = req.body;
    req.user.about = about;
    req.user.skills = skills;
    await req.user.save();
    res.json({ message: 'Profile updated successfully!', about: req.user.about, skills: req.user.skills });
  } catch (error) {
    console.error('Error updating summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
