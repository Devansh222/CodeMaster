



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Example categories
const categories = [
  "Array",
  "Binary",
  "Binary Search",
  "Binary Search Tree",
  "Binary Tree",
  "Dynamic Programming",
  "Graph",
  "Hash Table",
  "Heap",
  "Linked List",
  "Math",
  "Matrix",
  "Queue",
  "Recursion",
  "Stack",
  "String",
  "Trie"
];

// A simple inline notification component for success/error info
const Notification = ({ message, type }) => {
  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500';
  return (
    <div className={`fixed top-4 right-4 p-3 ${bgColor} text-white rounded shadow-lg z-50`}>
      {message}
    </div>
  );
};

const Problems = () => {
  const [problems, setProblems] = useState([]);
  // Stores each question's status => { isSolved: boolean, notes: string }
  const [problemStatus, setProblemStatus] = useState({});
  // For toggling category expansion
  const [expandedCategory, setExpandedCategory] = useState(null);
  // For toggling notes text area per question
  const [expandedNotes, setExpandedNotes] = useState({});
  // For inline notifications (no alert popups)
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  // Helper to show a notification for 3 seconds
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // React.useEffect(() => {
  //   if (!token) {
  //     navigate('/login');
  //   }
  // }, [token, navigate]);

  // Fetch questions & user's solved data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate("/login");
          return;
        }
        const [questionsRes, solvedRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/questions`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/users/solved`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Build default status for each question => { isSolved: false, notes: "" }
        const statusMap = {};
        questionsRes.data.forEach(q => {
          const qID = String(q._id);
          statusMap[qID] = { isSolved: false, notes: "" };
        });

        // Merge the user's solved data
        solvedRes.data.forEach(subdoc => {
          const qID = subdoc.questionId;
          if (statusMap[qID]) {
            statusMap[qID].isSolved = true;
            statusMap[qID].notes = subdoc.notes || "";
          }
        });

        setProblems(questionsRes.data);
        setProblemStatus(statusMap);
      } catch (error) {
        console.error('Fetch error:', error);
        if (error.response?.status === 401) navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  // Mark a question as solved => PUT /api/users/solve/:questionId
  const handleSolve = async (questionId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate("/login");
      return;
    }
    if (problemStatus[questionId]?.isSolved) {
      showNotification("Question already solved!", "error");
      return;
    }
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/users/solve/${questionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Question solved successfully!", "success");
      const sp = res.data.solvedProblem; // { questionId, solvedAt, notes }
      setProblemStatus(prev => ({
        ...prev,
        [sp.questionId]: {
          isSolved: true,
          notes: sp.notes || ""
        }
      }));
    } catch (error) {
      console.error("Solve error:", error);
      showNotification(error.response?.data?.message || "Error solving question", "error");
    }
  };

  // Toggle the notes editor for a question
  const toggleNotes = (questionId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Update local notes
  const handleNotesChange = (questionId, newValue) => {
    setProblemStatus(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        notes: newValue
      }
    }));
  };

  // Save notes => PUT /api/users/notes/:questionId
  const saveNotes = async (questionId) => {
    const token = localStorage.getItem('token');
    const currentNotes = problemStatus[questionId]?.notes || "";
    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/users/notes/${questionId}`,
        { notes: currentNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification("Notes saved successfully!", "success");
    } catch (error) {
      console.error("Notes error:", error);
      showNotification(error.response?.data?.message || "Failed to save notes", "error");
    }
  };

  // Expand/collapse categories
  const handleToggleCategory = (cat) => {
    setExpandedCategory(prev => (prev === cat ? null : cat));
  };

  // Group questions by category
  const groupedByCategory = categories.map(cat => {
    const catQuestions = problems.filter(q => q.category === cat);
    return { category: cat, questions: catQuestions };
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <h1 className="text-3xl font-bold mb-6 text-center">Problems by Category</h1>

      {groupedByCategory.map(group => {
        // Count how many are solved in this category
        const solvedCount = group.questions.reduce((count, q) => {
          const qID = String(q._id);
          return count + (problemStatus[qID]?.isSolved ? 1 : 0);
        }, 0);

        return (
          <div key={group.category} className="mb-6 border rounded-lg shadow-sm">
            <div
              className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
              onClick={() => handleToggleCategory(group.category)}
            >
              <h2 className="text-xl font-semibold">{group.category}</h2>
              <span className="text-lg">
                {solvedCount} / {group.questions.length} Solved
              </span>
            </div>

            {expandedCategory === group.category && (
              <div className="p-4">
                {group.questions.length === 0 ? (
                  <div>No questions in this category.</div>
                ) : (
                  group.questions.map(question => {
                    const qID = String(question._id);
                    const { isSolved, notes } = problemStatus[qID] || {
                      isSolved: false,
                      notes: ""
                    };

                    return (
                      <div key={qID} className="mb-4 p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">
                              {question.name}
                              <span
                                className={`ml-2 text-sm px-2 py-1 rounded ${
                                  question.difficulty === 'easy'
                                    ? 'bg-green-100 text-green-800'
                                    : question.difficulty === 'medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {question.difficulty}
                              </span>
                            </h3>
                            <a
                              href={question.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Problem ↗
                            </a>
                          </div>

                          <div className="flex flex-col gap-2 items-end">
                            {/* Mark as Solved button */}
                            {!isSolved ? (
                              <button
                                onClick={() => handleSolve(qID)}
                                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                              >
                                Mark as Solved
                              </button>
                            ) : (
                              <button
                                disabled
                                className="px-2 py-1 rounded bg-green-600 text-white cursor-not-allowed"
                              >
                                Solved ✓
                              </button>
                            )}

                            {/* Notes button to show/hide the text area */}
                            <button
                              onClick={() => toggleNotes(qID)}
                              className="text-yellow-700 hover:text-yellow-900"
                            >
                              {expandedNotes[qID] ? 'Hide Notes' : 'Show Notes'}
                            </button>
                          </div>
                        </div>

                        {/* If the user solved the question and expanded the notes */}
                        {isSolved && expandedNotes[qID] && (
                          <div className="w-full mt-2">
                            <textarea
                              value={notes}
                              onChange={(e) => handleNotesChange(qID, e.target.value)}
                              onBlur={() => saveNotes(qID)}
                              className="w-full p-2 border rounded-lg"
                              rows="3"
                              placeholder="Add your notes here..."
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Problems;
