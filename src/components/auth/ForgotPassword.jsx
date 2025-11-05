import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('phone'); // 'phone', 'code', 'reset'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/verification/send`, {
        phone,
        type: 'RECOVERY',
      });
      if (res.data.success) {
        setStep('code');
      } else {
        throw new Error(res.data.message || 'Failed to send code');
      }
    } catch (err) {
      setError(err.message || 'Failed to send code');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/verification/reset-password`, {
        phone,
        code,
        newPassword,
      });
      if (res.data.success) {
        navigate('/login');
      } else {
        throw new Error(res.data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg p-8 max-w-[400px] w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {step === 'phone' && (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label className="text-[13px] font-medium text-gray-900 mb-1 block">Phone Number</label>
            <input
              type="tel"
              placeholder="+250123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-red-700 disabled:bg-red-400"
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="text-[13px] font-medium text-gray-900 mb-1 block">Verification Code</label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-[13px] font-medium text-gray-900 mb-1 block">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-red-700 disabled:bg-red-400"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;