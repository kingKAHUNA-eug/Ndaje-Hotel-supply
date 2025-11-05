import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signUpWithCredentials } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create user payload
      const userPayload = {
        name,
        email,
        phone,
        password,
        role: 'CLIENT',
      };

      // Sign up user
      const userRes = await signUpWithCredentials(userPayload);
      const user = userRes.user || userRes;

      // Show verification input
      setShowVerification(true);
      setLoading(false);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map((e) => e.message).join(', ');
        setError(errorMessages);
      } else {
        setError(err.message || 'Failed to sign up');
      }
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/verification/verify`, {
        phone,
        code: verificationCode,
        type: 'SIGNUP',
      });

      if (res.data.success) {
        // Create address payload
        const addressPayload = {
          line1,
          line2,
          city,
          state,
          postalCode,
          country,
        };

        // Call address creation endpoint
        const addressRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/addresses`,
          addressPayload,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (addressRes.data.success) {
          login(user);
          navigate('/dashboard');
        } else {
          throw new Error(addressRes.data.message || 'Failed to save address');
        }
      } else {
        throw new Error(res.data.message || 'Verification failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to verify code');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
        token: credentialResponse.credential,
      });

      if (res.data.success) {
        login(res.data.data.user, res.data.data.token);
        navigate('/dashboard');
      } else {
        throw new Error(res.data.message || 'Google sign-in failed');
      }
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 max-w-[400px] w-full mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[22px] font-bold text-gray-900">Sign Up</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <Link
          to="/login"
          className="flex-1 py-2 px-4 text-center text-[15px] font-medium text-gray-700 hover:text-gray-900"
        >
          Sign In
        </Link>
        <button className="flex-1 py-2 px-4 text-center text-[15px] font-medium text-gray-900 border-b-2 border-gray-900">
          Sign Up
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <div className="text-red-600 text-[13px] font-medium">{error}</div>}

        {/* Name field */}
        <div>
          <label className="text-[13px] font-medium text-gray-900 mb-1 block">Full Name</label>
          <input
            type="text"
            placeholder="Enter full name"
            className="w-full px-4 h-[52px] border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-[15px]"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email field */}
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone Number field */}
        <div>
          <label className="text-[13px] font-medium text-gray-900 mb-1 block">Phone Number</label>
          <input
            type="tel"
            placeholder="+250123456789"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Password field */}
        <div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                const input = document.querySelector('input[type="password"]');
                input.type = input.type === 'password' ? 'text' : 'password';
              }}
            >
              Show
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
        </div>

        {/* Address fields */}
        <div>
          <label className="text-[13px] font-medium text-gray-900 mb-1 block">Address Line 1</label>
          <input
            type="text"
            placeholder="Street address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-gray-900 mb-1 block">Address Line 2 (optional)</label>
          <input
            type="text"
            placeholder="Apartment, suite, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-gray-900 mb-1 block">City</label>
          <input
            type="text"
            placeholder="City"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-gray-900 mb-1 block">State (optional)</label>
          <input
            type="text"
            placeholder="State"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-gray-900 mb-1 block">Postal Code (optional)</label>
          <input
            type="text"
            placeholder="Postal Code"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-gray-900 mb-1 block">Country</label>
          <input
            type="text"
            placeholder="Country"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        {/* Verification Code Input */}
        {showVerification && (
          <div>
            <label className="text-[13px] font-medium text-gray-900 mb-1 block">Verification Code</label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button
              type="button"
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleVerifyCode}
            >
              Verify Code
            </button>
          </div>
        )}

        {/* Terms and conditions */}
        <p className="text-xs text-gray-600">
          By tapping "Sign Up" you agree to NDAJE's{' '}
          <a href="#" className="text-red-600 hover:text-red-700">Terms</a>, including a waiver of
          your jury trial right, and{' '}
          <a href="#" className="text-red-600 hover:text-red-700">Privacy Policy</a>.
        </p>

        <button
          type="submit"
          disabled={loading || showVerification}
          className="w-full bg-red-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-red-700 transition-colors disabled:bg-red-400"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <div className="relative py-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-gray-500">or continue with</span>
        </div>
      </div>

      <div className="space-y-3">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google sign-in failed')}
        />
      </div>
    </div>
  );
}

export default Signup;