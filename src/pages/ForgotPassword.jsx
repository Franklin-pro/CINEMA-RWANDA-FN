import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/api/auth';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await authService.requestPasswordResetOTP(email);
      setSuccess('OTP sent to your email.');
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPasswordWithOTP({ email, otp, newPassword });
      setSuccess('Password reset successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white px-4 pt-24 pb-12 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
        <p className="text-gray-400 mb-6">
          {step === 'request' ? 'Enter your account email to receive an OTP.' : 'Enter the OTP and your new password.'}
        </p>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 rounded text-red-300 text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/40 rounded text-green-300 text-sm">{success}</div>}

        {step === 'request' ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-black font-semibold py-3 rounded-lg"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg outline-none focus:border-blue-400"
            />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit OTP"
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg outline-none focus:border-blue-400"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg outline-none focus:border-blue-400"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-black font-semibold py-3 rounded-lg"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-sm text-gray-400">
          <Link to="/login" className="text-blue-400 hover:text-blue-300">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
