import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Tractor } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-agLight px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-agGreen-400 to-agGreen-600"></div>
        
        <div className="flex flex-col items-center mb-8 mt-2">
          <div className="bg-agGreen-50 p-3 rounded-full mb-3 text-agGreen-600">
            <Tractor size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">AgriTrack System</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to access your fleet operations</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 p-3 rounded-lg border border-red-100 text-red-600 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agGreen-500 focus:border-agGreen-500 sm:text-sm transition-all bg-gray-50 focus:bg-white text-gray-900 font-medium" 
              placeholder="you@farm.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agGreen-500 focus:border-agGreen-500 sm:text-sm transition-all bg-gray-50 focus:bg-white text-gray-900 font-medium" 
              placeholder="••••••••"
            />
          </div>
          <div className="mt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgb(34,197,94,0.39)] text-sm font-bold text-white bg-agGreen-600 hover:bg-agGreen-500 hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agGreen-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="font-semibold text-agGreen-600 hover:text-agGreen-500 transition-colors">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
