import React from 'react';
import Sidebar from './components/Sidebar'; // Adjust the import based on your structure

const SettingsPage = ({ resetData }) => {
  const handleResetData = () => {
    // Clear local storage and invoke reset function
    localStorage.clear();
    resetData();
  };

  return (
    <div className="flex min-h-screen bg-white text-green-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Reset Data Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Reset Data</h2>
          <p className="text-green-700 mb-6">
            Resetting will clear all data stored locally, including your financial records and savings goals. This action cannot be undone.
          </p>
          <button
            onClick={handleResetData}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold p-3 rounded transition-colors"
          >
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
