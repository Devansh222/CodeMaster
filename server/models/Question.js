// server/models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  link:       { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  category: {
    type: String,
    enum: [
      'Array', 'Binary', 'Binary Search', 'Binary Search Tree', 'Binary Tree',
      'Dynamic Programming', 'Graph', 'Hash Table', 'Heap', 'Linked List',
      'Math', 'Matrix', 'Queue', 'Recursion', 'Stack', 'String', 'Trie'
    ],
    required: true
  }
});

module.exports = mongoose.model('Question', QuestionSchema);
