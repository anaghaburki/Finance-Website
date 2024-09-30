import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-8 text-gray-300">Finance Manager</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/home" className="hover:bg-gray-700 p-2 rounded block">Home</Link>
          </li>
          <li className="mb-4">
            <Link to="/add-record" className="hover:bg-gray-700 p-2 rounded block">Add Record</Link>
          </li>
          <li className="mb-4">
            <Link to="/analytics" className="hover:bg-gray-700 p-2 rounded block">Analytics</Link>
          </li>
          <li className="mb-4">
            <Link to="/savings" className="hover:bg-gray-700 p-2 rounded block">Saving Plan</Link>
          </li>
          <li className="mb-4">
            <Link to="/settings" className="hover:bg-gray-700 p-2 rounded block">Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
