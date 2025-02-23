import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// Simple Notification component
const Notification = ({ message, type }) => {
  const bgColor = type === 'success' ? 'bg-blue-400' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500';
  return (
    <div className={`fixed top-4 right-4 p-3 ${bgColor} text-white rounded shadow-lg z-50`}>
      {message}
    </div>
  );
};

const Dashboard = () => {
  const [progress, setProgress] = useState({ easy: 0, medium: 0, hard: 0 });
  const [total, setTotal] = useState({ easy: 0, medium: 0, hard: 0 });
  const [stars, setStars] = useState(0);
  const [activityData, setActivityData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [activeDays, setActiveDays] = useState(0);
  const [summary, setSummary] = useState({ about: '', skills: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ about: '', skills: '' });
  const [notification, setNotification] = useState(null);
  const username = localStorage.getItem('username') || 'User';

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        // 1) progress
        const progressRes = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/users/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProgress(progressRes.data);

        // 2) all questions for totals
        const questionsRes = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/questions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        let easyCount = 0, mediumCount = 0, hardCount = 0;
        questionsRes.data.forEach(q => {
          if (q.difficulty === 'easy') easyCount++;
          if (q.difficulty === 'medium') mediumCount++;
          if (q.difficulty === 'hard') hardCount++;
        });
        setTotal({ easy: easyCount, medium: mediumCount, hard: hardCount });

        // 3) compute stars
        const starCount = Math.min(
          Math.floor(progressRes.data.easy / 6),
          Math.floor(progressRes.data.medium / 3),
          Math.floor(progressRes.data.hard / 1)
        );
        setStars(starCount);

        // 4) activity
        const activityRes = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/users/activity`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivityData(activityRes.data);
        const { streak, totalActive } = computeStreakAndActiveDays(activityRes.data);
        setCurrentStreak(streak);
        setActiveDays(totalActive);

        // 5) summary
        const summaryRes = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/users/summary`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(summaryRes.data);
        setProfileForm({ about: summaryRes.data.about, skills: summaryRes.data.skills });

      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardData();
  }, []);

  const computeStreakAndActiveDays = (data) => {
    if (!data || data.length === 0) return { streak: 0, totalActive: 0 };
    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const totalActive = sorted.filter(item => item.count > 0).length;
    let streak = 0;
    const today = new Date();
    let iterator = new Date(today);
    while (true) {
      const dateStr = iterator.toISOString().split('T')[0];
      const dayData = sorted.find(item => item.date === dateStr);
      if (dayData && dayData.count > 0) {
        streak++;
        iterator.setDate(iterator.getDate() - 1);
      } else {
        break;
      }
    }
    return { streak, totalActive };
  };

  const pieData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      data: [progress.easy, progress.medium, progress.hard],
      backgroundColor: ['#4ade80', '#facc15', '#f87171']
    }]
  };

  const shiftDate = (date, numDays) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  };

  // Profile update
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/users/summary`, profileForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification(res.data.message, 'success');
      setSummary({ about: res.data.about, skills: res.data.skills });
      setIsEditingProfile(false);
    } catch (error) {
      console.error(error);
      showNotification(error.response?.data?.message || 'Error updating profile', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      {notification && <Notification message={notification.message} type={notification.type} />}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Welcome {username}</h1>
      </header>
      <section className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-2xl font-bold mb-2">About Me</h2>
        {isEditingProfile ? (
          <>
            <textarea
              name="about"
              value={profileForm.about}
              onChange={handleProfileChange}
              className="w-full p-2 border rounded-lg mb-2"
              rows="3"
            />
            <input
              type="text"
              name="skills"
              value={profileForm.skills}
              onChange={handleProfileChange}
              className="w-full p-2 border rounded-lg mb-2"
              placeholder="Enter your skills"
            />
            <button onClick={saveProfile} className="mt-3 text-blue-600 hover:text-blue-700">
              Save Profile
            </button>
            <button onClick={() => setIsEditingProfile(false)} className="ml-3 text-grey-600 hover:text-grey-700">
              Cancel
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-700">{summary.about || "No summary available."}</p>
            <p className="text-gray-700 mt-2"><strong>Skills:</strong> {summary.skills || "No skills provided."}</p>
            <button onClick={() => setIsEditingProfile(true)} className="mt-2 text-blue-500 hover:text-blue-600">
              Edit Profile
            </button>
          </>
        )}
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Your Progress</h2>
        <div className="flex flex-col md:flex-row items-center justify-around">
          <div className="w-64 mx-auto">
            <Pie data={pieData} />
          </div>
          <div className="mt-4 md:mt-0 text-center">
            <div className="mb-2">
              <span className="font-bold text-lg">Stars Earned: </span>
              <span className="text-xl">{stars} ⭐</span>
            </div>
            <div>
              <p className="text-lg">
                Easy: <span className="font-bold">{progress.easy} / {total.easy}</span>
              </p>
              <p className="text-lg">
                Medium: <span className="font-bold">{progress.medium} / {total.medium}</span>
              </p>
              <p className="text-lg">
                Hard: <span className="font-bold">{progress.hard} / {total.hard}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Activity Heatmap</h2>
        <div className="flex justify-center">
          <CalendarHeatmap
            startDate={shiftDate(new Date(), -150)}
            endDate={new Date()}
            values={activityData} // array of { date, count }
            classForValue={(value) => {
              if (!value || value.count === 0) {
                return 'color-empty';
              }
              return `color-scale-${Math.min(value.count, 4)}`;
            }}
            tooltipDataAttrs={(value) => {
              if (!value || !value.date) {
                return { 'data-tip': 'No activity' };
              }
              return { 'data-tip': `${value.date}: ${value.count} solves` };
            }}
            showWeekdayLabels={true}
          />
        </div>
        <div className="text-center mt-4">
          <p className="text-lg font-bold">Current Streak: {currentStreak} days</p>
          <p className="text-lg font-bold">Total Active Days: {activeDays}</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
