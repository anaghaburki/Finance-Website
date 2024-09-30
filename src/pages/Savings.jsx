import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';

function Savings() {
  const [goal, setGoal] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [savedAmount, setSavedAmount] = useState(0);
  const [savingsPercentage, setSavingsPercentage] = useState(0);

  // Load savings data from local storage
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('savingsData'));
    if (savedData) {
      setSavedAmount(savedData.savedAmount);
      setSavingsGoal(savedData.savingsGoal);
      if (savedData.savingsGoal > 0) {
        setSavingsPercentage((savedData.savedAmount / savedData.savingsGoal) * 100);
      }
    }
  }, []);

  // Save data to local storage
  const saveToLocalStorage = (goal, amount) => {
    const savingsData = {
      savingsGoal: goal,
      savedAmount: amount,
    };
    localStorage.setItem('savingsData', JSON.stringify(savingsData));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (savingsAmount && goal) {
      const totalSaved = savedAmount + parseFloat(savingsAmount);
      saveToLocalStorage(goal, totalSaved);
      setSavedAmount(totalSaved);
      setSavingsGoal(goal);
      setSavingsPercentage((totalSaved / goal) * 100);
      setSavingsAmount('');
      setGoal('');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold text-green-900 mb-6">Savings Goals</h1>

        {/* Savings Goal Form */}
        <form onSubmit={handleAddGoal} className="mb-6">
          <div className="mb-4">
            <label className="block text-green-900 font-semibold mb-2">Goal Description</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
              className="w-full p-2 border border-green-700 rounded bg-gray-50"
              placeholder="Enter your savings goal"
            />
          </div>
          <div className="mb-4">
            <label className="block text-green-900 font-semibold mb-2">Amount to Save</label>
            <input
              type="number"
              value={savingsAmount}
              onChange={(e) => setSavingsAmount(e.target.value)}
              required
              className="w-full p-2 border border-green-700 rounded bg-gray-50"
              placeholder="Enter amount to save"
            />
          </div>
          <button type="submit" className="w-full bg-green-900 text-white p-2 rounded hover:bg-green-700">
            Add Goal
          </button>
        </form>

        {/* Savings Status Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-green-900">Current Savings Status</h2>
          <p className="text-green-700 mt-2">
            <span className="font-bold">Goal: </span>${savingsGoal || 0}
          </p>
          <p className="text-green-700 mt-2">
            <span className="font-bold">Saved Amount: </span>${savedAmount || 0}
          </p>
          <p className="text-green-700 mt-2">
            <span className="font-bold">Percentage Saved: </span>{(savingsPercentage || 0).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default Savings;
