import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-200 to-purple-300 text-gray-800 px-4">
      <h1 className="mt-30 text-4xl md:text-5xl font-extrabold mb-4 text-center">
        Welcome to CodeMaster!
      </h1>
      <p className="text-lg md:text-xl mb-8 text-center">
        Practice, solve, and track your progress on coding challenges.
      </p>
      <div className="mt-20 flex flex-col sm:flex-row gap-4 mb-8">
        <Link
          to="/login"
          className="bg-blue-500 text-white font-bold px-6 py-3 rounded-full hover:bg-blue-600 transition shadow-md text-center"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-white border border-blue-500 text-blue-500 font-bold px-6 py-3 rounded-full hover:bg-blue-500 hover:text-white transition shadow-md text-center"
        >
          Sign Up
        </Link>
      </div>
      <div className="mt-30 max-w-2xl mt-10 mx-auto text-center p-8 bg-white/80 backdrop-blur-md rounded-lg shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-4">Track Your Progress</h2>
        <p className="text-lg text-gray-800 mb-6">
          Once you sign up and log in, you can start solving a wide range of coding challenges. Your performance is tracked on your Dashboard, where you can:
        </p>
        <ul className="list-disc list-inside text-left text-gray-700 mb-6 space-y-2">
          <li className="text-lg">
            <span className="font-bold">View Problem Progress:</span> See how many problems you’ve solved in each difficulty level.
          </li>
          <li className="text-lg">
            <span className="font-bold">Earn Stars ⭐:</span> Gain stars based on your performance as you solve more problems.
            <br />
            <span className="font-bold">
              To earn 1 star, you must solve at least 6 easy, 3 medium, and 1 hard problems.
            </span>
          </li>
          <li className="text-lg">
            <span className="font-bold">Monitor Daily Activity:</span> A visual heatmap shows your problem-solving streak and active days.
          </li>
        </ul>
        <p className="text-xl text-gray-900 font-semibold">
          Start your journey now—sign up or log in to challenge yourself and watch your skills grow!
        </p>
      </div>
      <div className="mt-10 mb-20 max-w-2xl mt-10 mx-auto p-8 bg-white/80 backdrop-blur-md rounded-lg shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-4 text-center">
          Admin Panel Features
        </h2>
        <p className="text-lg text-gray-800 mb-6">
          Administrators have exclusive access to powerful management tools. These features include:
        </p>
        <ul className="list-disc list-inside text-left text-gray-700 mb-6 space-y-2">
          <li className="text-lg">
            <span className="font-bold">User Management:</span> View, edit, or delete user accounts.
          </li>
          <li className="text-lg">
            <span className="font-bold">Problem Management:</span> Add, update, or delete coding problems.
          </li>
          <li className="text-lg">
            <span className="font-bold">Login Logs:</span> Monitor user activity and track logins.
          </li>
          <li className="text-lg">
            <span className="font-bold">Dashboard Insights:</span> Access analytics and usage statistics.
          </li>
        </ul>
        <p className="text-xl text-gray-900 font-semibold">
          Only authorized admin users can access these features. If you are an admin, please log in to access the Admin Panel.
        </p>
      </div>
    </div>
  );
};

export default Home;
