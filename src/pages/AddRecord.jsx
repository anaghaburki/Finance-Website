import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function AddRecord({ updateBalance, updateLogs }) {
  const [type, setType] = useState('income');  // Default to 'income'
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleAddRecord = (e) => {
    e.preventDefault();
    const recordAmount = type === 'income' ? parseFloat(amount) : -parseFloat(amount);

    // Update balance and logs using parent functions
    updateBalance(recordAmount);
    updateLogs({ description, amount: recordAmount });

    // Redirect back to home page after submission
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen bg-green-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-gray-800 p-8 rounded shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-green-300 mb-6">Add Record</h1>
          <form onSubmit={handleAddRecord}>
            {/* Select Record Type */}
            <div className="mb-4">
              <label className="block text-green-300 font-semibold mb-2">Record Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-green-100"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-green-300 font-semibold mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-green-100"
              />
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-green-300 font-semibold mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-green-100"
              />
            </div>

            <button type="submit" className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-600">
              Add Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddRecord;
