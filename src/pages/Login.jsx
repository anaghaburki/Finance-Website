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
    <div className="flex min-h-screen">
      <div className="flex-1 p-8 bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-green-900 mb-6 text-center">Welcome Back!</h1>
          <p className="text-green-700 mb-4 text-center">Login to continue</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-green-700 rounded bg-gray-50 focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-green-700 rounded bg-gray-50 focus:outline-none"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-700 transition-all"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
