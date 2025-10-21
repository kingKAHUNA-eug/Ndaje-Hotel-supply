import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signUpWithCredentials } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = { email, password, name }
      const res = await signUpWithCredentials(payload)
      const user = res.user || res
      login(user)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.message || 'Failed to sign up')
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg p-8 max-w-[400px] w-full mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[22px] font-bold text-gray-900">Sign in or Sign up</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Toggle buttons for Sign In/Sign Up */}
      <div className="flex gap-3 mb-6">
        <Link
          to="/login"
          className="flex-1 py-2 px-4 text-center text-[15px] font-medium text-gray-700 hover:text-gray-900"
        >
          Sign In
        </Link>
        <button 
          className="flex-1 py-2 px-4 text-center text-[15px] font-medium text-gray-900 border-b-2 border-gray-900"
        >
          Sign Up
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="text-red-600 text-[13px] font-medium">
            {error}
          </div>
        )}

        {/* Name fields */}
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-medium text-gray-900 mb-1 block">
              First Name
            </label>
            <input
              type="text"
              placeholder=""
              className="w-full px-4 h-[52px] border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-[15px]"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="text-red-600 text-[13px] font-medium mt-1">First name is required</div>
          </div>
          <div>
            <label className="text-[13px] font-medium text-gray-900 mb-1 block">
              Last Name
            </label>
            <input
              type="text"
              placeholder=""
              className="w-full px-4 h-[52px] border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-[15px]"
              required
            />
          </div>
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
        <div className="flex gap-2">
          <div className="w-[90px]">
            <select 
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
              defaultValue="+250"
            >
              <option value="+250">+250</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
          </div>
          <input
            type="tel"
            placeholder="Mobile Number"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            required
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
                const input = document.querySelector('input[type="password"]')
                input.type = input.type === 'password' ? 'text' : 'password'
              }}
            >
              Show
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">At least 10 characters</p>
        </div>

        {/* Terms and conditions */}
        <p className="text-xs text-gray-600">
          By tapping "Sign Up" or "Continue with..." you agree to NDAJE's{' '}
          <a href="#" className="text-red-600 hover:text-red-700">Terms</a>,
          including a waiver of your jury trial right, and{' '}
          <a href="#" className="text-red-600 hover:text-red-700">Privacy Policy</a>.
          We may text you a verification code. Msg & data rates apply.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-red-700 transition-colors disabled:bg-red-400"
        >
          {loading ? 'Creating account...' : 'Continue to Sign Up'}
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

      {/* Social login buttons */}
      <div className="space-y-3">
        <button type="button" className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>
        
        <button type="button" className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continue with Facebook
        </button>
        
        <button type="button" className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M17.569 12.6254C17.597 15.652 20.2179 16.8348 20.247 16.8483C20.2248 16.9241 19.8282 18.1805 18.8902 19.4819C18.0697 20.6199 17.2092 21.7537 15.8925 21.7828C14.6022 21.8111 14.1666 21.0379 12.6992 21.0379C11.2318 21.0379 10.7453 21.7537 9.52385 21.8111C8.26358 21.8685 7.27049 20.5964 6.44154 19.4659C4.74942 17.1569 3.48632 12.9897 5.22851 10.1723C6.0921 8.77359 7.64544 7.88454 9.33756 7.85639C10.5715 7.82825 11.7294 8.67571 12.4974 8.67571C13.2654 8.67571 14.6751 7.68246 16.1424 7.82825C16.8114 7.85639 18.6616 8.11147 19.8442 9.81165C19.7492 9.87793 17.5469 11.1235 17.569 12.6254ZM15.2244 5.89505C15.9197 5.05759 16.3925 3.88143 16.2721 2.71484C15.2506 2.75766 14.0177 3.34196 13.2952 4.17899C12.647 4.92334 12.0788 6.12807 12.1992 7.26608C13.3317 7.35093 14.529 6.73271 15.2244 5.89505Z"/>
          </svg>
          Continue with Apple
        </button>
      </div>
    </div>
  )
}

export default Signup


