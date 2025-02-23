// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email:    { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role:     { type: String, enum: ['user', 'admin'], default: 'user' },
//   solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
// });

// module.exports = mongoose.model('User', UserSchema);



// // server/models/User.js
// const mongoose = require('mongoose');

// const SolvedProblemSchema = new mongoose.Schema({
//   question: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Question',
//     required: true
//   },
//   solvedAt: {
//     type: Date,
//     default: Date.now
//   },
//   notes: {
//     type: String,
//     default: ''
//   }
// });

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email:    { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role:     { type: String, enum: ['user', 'staff', 'admin'], default: 'user' },

//   // We store solved problems as an array of subdocs, each containing question, solvedAt, notes
//   solvedProblems: [SolvedProblemSchema],

//   about:  { type: String, default: '' },
//   skills: { type: String, default: '' }
// });

// module.exports = mongoose.model('User', UserSchema);





// server/models/User.js
// const mongoose = require('mongoose');

// const SolvedProblemSchema = new mongoose.Schema({
//   question: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Question',
//     required: true
//   },
//   solvedAt: {
//     type: Date,
//     default: Date.now
//   },
//   notes: {
//     type: String,
//     default: ''
//   }
// });

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email:    { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role:     { type: String, enum: ['user', 'staff', 'admin'], default: 'user' },

//   // Subdocs for solved problems
//   solvedProblems: [SolvedProblemSchema],

//   about:  { type: String, default: '' },
//   skills: { type: String, default: '' }
// });

// module.exports = mongoose.model('User', UserSchema);



// server/models/User.js
// server/models/User.js
// server/models/User.js
// server/models/User.js
// const mongoose = require('mongoose');

// const SolvedProblemSchema = new mongoose.Schema({
//   question: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Question',
//     required: true
//   },
//   solvedAt: {
//     type: Date,
//     default: null // null means not solved
//   },
//   notes: {
//     type: String,
//     default: ''
//   }
// });

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email:    { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role:     { type: String, enum: ['user', 'staff', 'admin'], default: 'user' },

//   // Each subdoc has { question, solvedAt, notes }
//   solvedProblems: [SolvedProblemSchema],

//   about:  { type: String, default: '' },
//   skills: { type: String, default: '' }
// });

// module.exports = mongoose.model('User', UserSchema);






const mongoose = require('mongoose');

/**
 * We'll store each solved question as:
 * {
 *   questionId: String,  // The _id of the question
 *   solvedAt: Date,      // The date/time the user solved it
 *   notes: String        // The user's notes
 * }
 */
const SolvedSchema = new mongoose.Schema({
  questionId: {
    type: String, 
    required: true
  },
  solvedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user', 'staff', 'admin'], default: 'user' },

  // We store solved as an array of subdocs
  solved: [SolvedSchema],

  about:  { type: String, default: '' },
  skills: { type: String, default: '' }
});

module.exports = mongoose.model('User', UserSchema);
