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
      <div className="flex-1 flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-green-900 mb-6">Add Record</h1>
          <form onSubmit={handleAddRecord}>
            {/* Select Record Type */}
            <div className="mb-4">
              <label className="block text-green-900 font-semibold mb-2">Record Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-green-700 rounded"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-green-900 font-semibold mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-2 bg-gray-50 border border-green-700 rounded"
                placeholder="Enter description"
              />
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-green-900 font-semibold mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full p-2 bg-gray-50 border border-green-700 rounded"
                placeholder="Enter amount"
              />
            </div>

            <button type="submit" className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-green-700 transition-all">
              Add Record
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddRecord;
