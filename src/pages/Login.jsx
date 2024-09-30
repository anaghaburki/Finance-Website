import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Check password
    if (password === 'password1') {
      // Store username in local storage
      localStorage.setItem('username', username);
      // Navigate to home page
      navigate('/home');
    } else {
      setError('Oops! Incorrect password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-900">
      <div className="bg-green-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Welcome Back!</h1>
        <p className="text-white mb-4">Login to continue</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-green-700 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-green-700 border border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 transition-all"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
