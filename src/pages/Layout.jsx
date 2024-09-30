import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Finance Tracker</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/" className="text-green-500 hover:text-green-700">Home</Link>
            </li>
            <li className="mb-2">
              <Link to="/add-record" className="text-green-500 hover:text-green-700">Add Record</Link>
            </li>
            <li className="mb-2">
              <Link to="/analytics" className="text-green-500 hover:text-green-700">Analytics</Link>
            </li>
            <li className="mb-2">
              <Link to="/settings" className="text-green-500 hover:text-green-700">Settings</Link>
            </li>
            <li className="mb-2">
              <Link to="/saving-plans" className="text-green-500 hover:text-green-700">Saving Plans</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
