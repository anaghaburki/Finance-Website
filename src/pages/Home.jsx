import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { Link } from 'react-router-dom';

function Home() {
  const userName = localStorage.getItem('userName');
  const [balance, setBalance] = useState(0);  // Start with 0 balance
  const [lastLogs, setLastLogs] = useState([]);  // No logs initially
  const [savingsGoal, setSavingsGoal] = useState(null);  // No goals initially

  const updateBalance = (amount) => {
    setBalance((prevBalance) => prevBalance + amount);
  };

  const updateLogs = (newLog) => {
    setLastLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 3)]);
  };

  return (
    <div className="flex min-h-screen bg-green-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-green-300 mb-6">
          Welcome to your Finance Dashboard, {userName}!
        </h1>

        {/* Add Record Button */}
        <Link to="/add-record">
          <button className="bg-green-700 text-white p-2 rounded mb-8 hover:bg-green-600">
            Add New Record
          </button>
        </Link>

        {/* Balance Section */}
        <div className="bg-green-800 p-6 shadow-lg rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-green-300 mb-2">Current Balance</h2>
          <p className="text-4xl text-green-200 font-bold">${balance}</p>
        </div>

        {/* Last 4 Logs Section */}
        <div className="bg-green-800 p-6 shadow-lg rounded-lg mb-8">
          <h2 className="text-xl font-semibold text-green-300 mb-2">Last 4 Logs</h2>
          {lastLogs.length > 0 ? (
            <ul>
              {lastLogs.map((log, index) => (
                <li key={index} className="flex justify-between py-2 border-b border-green-700">
                  <span className="text-green-200">{log.description}</span>
                  <span className={`font-bold ${log.amount > 0 ? 'text-green-400' : 'text-red-500'}`}>
                    {log.amount > 0 ? '+' : ''}${log.amount}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-500">No records yet. Add your first record!</p>
          )}
        </div>

        {/* Savings Goal Section */}
        <div className="bg-green-800 p-6 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-green-300 mb-2">Savings Goal</h2>
          {savingsGoal ? (
            <p className="text-green-200">
              You have saved ${savingsGoal.savedAmount}, which is {savingsGoal.percentage}% towards your goal of ${savingsGoal.goalAmount}.
            </p>
          ) : (
            <p className="text-green-500">No savings goal yet. Set your savings goal!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
