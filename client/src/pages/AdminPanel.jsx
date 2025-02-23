


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const categories = [
  'Array', 'Binary', 'Binary Search', 'Binary Search Tree', 'Binary Tree',
  'Dynamic Programming', 'Graph', 'Hash Table', 'Heap', 'Linked List',
  'Math', 'Matrix', 'Queue', 'Recursion', 'Stack', 'String', 'Trie'
];

const AdminPanel = () => {
  const [questionData, setQuestionData] = useState({
    name: '',
    link: '',
    difficulty: 'easy',
    category: 'Array'
  });
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  // For adding a new question
  const onChange = e => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/questions`, questionData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage(`Question added: ${res.data.name}`);
      setQuestionData({ name: '', link: '', difficulty: 'easy', category: 'Array' });
      fetchQuestions();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding question');
    }
  };

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/questions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAllQuestions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Instead of showing logs here, we now add a button to view login logs on a separate page.
  const gotoLoginLogs = () => {
    window.location.href = '/admin/login-logs';
  };

  // Delete question
  const deleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Question deleted successfully');
      fetchQuestions();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error deleting question');
    }
  };

  // Expand/collapse category list
  const toggleCategory = (cat) => {
    setExpandedCategory(prev => (prev === cat ? null : cat));
  };

  // Group questions by category
  const groupedByCategory = categories.map(cat => {
    const catQuestions = allQuestions.filter(q => q.category === cat);
    return { category: cat, questions: catQuestions };
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>

      {/* Top Navigation */}
      <div className="mb-6 flex flex-wrap gap-4">
        <a href="/admin/users" className="bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-700 transition">
          Manage Users
        </a>
        <button 
          onClick={gotoLoginLogs} 
          className="bg-indigo-600 text-white px-4 py-2 rounded font-bold hover:bg-indigo-700 transition"
        >
          View Login Logs
        </button>
      </div>

      {/* Add Question Form */}
      <div className="border p-6 mb-8 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Add Question</h3>
        {message && <div className="bg-green-200 text-green-800 p-2 mb-4 rounded">{message}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="font-semibold">Question Name:</label>
            <input
              type="text"
              name="name"
              value={questionData.name}
              onChange={onChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Link:</label>
            <input
              type="text"
              name="link"
              value={questionData.link}
              onChange={onChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Difficulty:</label>
            <select
              name="difficulty"
              value={questionData.difficulty}
              onChange={onChange}
              className="w-full p-2 border rounded"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="font-semibold">Category:</label>
            <select
              name="category"
              value={questionData.category}
              onChange={onChange}
              className="w-full p-2 border rounded"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold">
            Add Question
          </button>
        </form>
      </div>

      {/* Questions by Category */}
      <div className="border p-6 rounded-lg mb-8">
        <h3 className="text-2xl font-bold mb-4">Manage Questions by Category</h3>
        {groupedByCategory.map(group => (
          <div key={group.category} className="mb-4 border p-4 rounded">
            <div
              className="flex justify-between cursor-pointer"
              onClick={() => toggleCategory(group.category)}
            >
              <span className="font-bold text-xl">{group.category}</span>
              <span className="text-lg">{group.questions.length} Questions</span>
            </div>
            {expandedCategory === group.category && (
              <div className="mt-4">
                {group.questions.length === 0 ? (
                  <div>No questions in this category.</div>
                ) : (
                  group.questions.map(q => (
                    <div key={q._id} className="flex flex-col md:flex-row justify-between items-center border-b py-3">
                      <div>
                        <p className="font-semibold text-lg">
                          {q.name} <span className="text-sm font-normal">({q.difficulty})</span>
                        </p>
                        <a
                          href={q.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Problem
                        </a>
                      </div>
                      <button
                        onClick={() => deleteQuestion(q._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold mt-2 md:mt-0"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
