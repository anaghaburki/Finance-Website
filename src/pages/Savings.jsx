import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';

function Savings() {
  const [goal, setGoal] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [savedAmount, setSavedAmount] = useState(0);
  const [savingsPercentage, setSavingsPercentage] = useState(0);

  // Load savings data from the database
  useEffect(() => {
    fetch('http://localhost:5000/savings')
      .then(response => response.json())
      .then(data => {
        if (data) {
          setSavedAmount(data.savedAmount || 0);
          setSavingsGoal(data.savingsGoal || 0);
          if (data.savingsGoal > 0) {
            setSavingsPercentage((data.savedAmount / data.savingsGoal) * 100);
          }
        }
      })
      .catch(error => console.error('Error fetching savings data:', error));
  }, []);

  // Save data to the database
  const saveToDatabase = (goal, amount) => {
    const savingsData = {
      goal,
      savingsGoal: parseFloat(goal),
      savedAmount: amount,
    };

    fetch('http://localhost:5000/savings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(savingsData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Saved to database:', data);
      })
      .catch(error => console.error('Error saving data:', error));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    const parsedSavingsAmount = parseFloat(savingsAmount);

    if (parsedSavingsAmount > 0 && goal.trim() !== '') {
      const totalSaved = savedAmount + parsedSavingsAmount;
      saveToDatabase(goal, totalSaved);
      setSavedAmount(totalSaved);
      setSavingsGoal(goal);
      if (goal > 0) {
        setSavingsPercentage((totalSaved / goal) * 100);
      }
      setSavingsAmount('');
      setGoal('');
    } else {
      alert('Please enter a valid goal and amount to save.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-green-900 mb-6">Savings Goals</h1>

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

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-green-900">Current Savings Status</h2>
          <p className="text-green-700 mt-2">
            <span className="font-bold">Goal: </span>₹{savingsGoal || 0}
          </p>
          <p className="text-green-700 mt-2">
            <span className="font-bold">Saved Amount: </span>₹{savedAmount || 0}
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
