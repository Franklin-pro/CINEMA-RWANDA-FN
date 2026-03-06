import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth } from '../store/slices/authSlice';

function GoogleCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const rawUser = params.get('user');

        if (!token || !rawUser) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(rawUser);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(setAuth({ user, token }));
        navigate('/');
      } catch (err) {
        console.error('Google callback error:', err);
        navigate('/login');
      }
    };

    handleCallback();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Completing Sign In</h1>
        <p className="text-gray-400">Please wait while we authenticate your Google account...</p>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">Error: {error}</p>
            <button
              onClick={() => window.location.href = '/login'}
              className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoogleCallback;
