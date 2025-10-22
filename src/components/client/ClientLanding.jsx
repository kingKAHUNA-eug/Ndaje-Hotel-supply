import React, { useMemo, useState } from 'react'
import Logo from '../common/Logo'
 

// Image imports
import LandingImage7 from '../../assets/images/LandingImage_7.png'
import LandingImage00 from '../../assets/images/LandingImage_00.png'
import LandingImage2 from '../../assets/images/LandingImage_2.png'
import mobile from '../../assets/images/mobile.png'

const countryOptions = [
  { code: "+250", name: "Rwanda", flag: "🇷🇼" },
  { code: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "+255", name: "Tanzania", flag: "🇹🇿" },
  { code: "+256", name: "Uganda", flag: "🇺🇬" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+1", name: "USA", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" },
];

function ClientLanding() {
  
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [countryCode, setCountryCode] = useState("+250");
  const [phone, setPhone] = useState("");

  const isValid = () => {
    if (countryCode === "+250") {
      return phone.startsWith("7");
    }
    return true;
  };

  const suggestions = useMemo(() => {
    const all = [
      'Downtown, Kigali',
      'Kimironko, Kigali',
      'Gikondo, Kigali',
      'Nyamirambo, Kigali',
      'Kicukiro, Kigali',
    ]
    if (!query) return all.slice(0, 4)
    return all.filter(x => x.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
  }, [query])

  return (
    <div className="min-h-screen bg-blue-900 text-white relative overflow-hidden">
      {/* Floating auth buttons */}
      <div className="absolute top-10 right-3 z-50 flex items-center gap-2">
        <button 
          onClick={() => setShowLogin(true)} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <span>👤</span>
          <span className="font-medium">Sign In</span>
        </button>
        <button 
          onClick={() => setShowSignup(true)} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-blue-900 hover:bg-gray-100 transition-colors">
          <span>👤</span>
          <span className="font-medium">Sign Up</span>
        </button>
      </div>
      
      {/* Centered logo */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50">
        <Logo variant="white" className="scale-90" />
      </div>

      {/* Hero */}
      <section className="relative h-[670px]">
        {/* Floating decorative images */}
        <img src={LandingImage7} alt="LandingImage_7" className="pointer-events-none select-none hidden md:block absolute left-[-80px] bottom-[-35px] w-110 rounded-3xl opacity-100 z-10 shadow-0xl" />
        <img src={LandingImage00} alt="LandingImage_00" className="pointer-events-none select-none hidden md:block absolute right-[-75px] bottom-[30px] w-130 rounded-3xl opacity-100 z-0 shadow-0xl" />
        <img src={LandingImage2} alt="LandingImage_2" className="pointer-events-none select-none hidden md:block absolute left-[-110px] top-[0px] w-130 rounded-3xl rotate-[45deg] opacity-100 z-0 shadow-0xl" />
        <img src={mobile} alt="mobile" className="pointer-events-none select-none hidden md:block absolute left-[160px] bottom-[-10px] w-72 rounded-3xl rotate-[-15deg] opacity-100 z-0 shadow-0xl" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-56 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-white drop-shadow">
            0 RWF DELIVERY FEE ON FIRST ORDER
          </h1>
          <p className="opacity-100 mb-4 text-gray-100">Other fees apply</p>

          {/* Address search */}
          <div className="max-w-[350px] mx-auto mt-6">
            <div className="bg-white rounded-full flex items-center gap-3 pr-2 pl-4 py-1 text-left shadow-lg">
              <span className="text-gray-500">📍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="Enter delivery address"
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 text-lg"
              />
              <button className="bg-blue-600 text-white rounded-full w-10 h-6 grid place-items-center hover:bg-blue-700 shadow">
                ➜
              </button>
            </div>
            {focused && suggestions.length > 0 && (
              <div className="mt-2 bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onMouseDown={() => setQuery(s)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3">
            <button 
              onClick={() => setShowLogin(true)}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-5 py-2.5 text-sm backdrop-blur-sm shadow transition-colors"
            >
              Sign in for saved address
            </button>
          </div>
        </div>
      </section>

      {/* Product objects band (cleaning, hygiene, hotel staples) */}
      <section className="relative bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sloped band area to place objects */}
          <div className="relative h-[360px] md:h-[420px] overflow-hidden">
            {/* DoorDash-style sections replacing floating product images */}
            <div className="flex items-center justify-center h-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Become a Dasher */}
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center relative">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-blue-600">
                          <circle cx="16" cy="32" r="4" fill="currentColor" />
                          <circle cx="32" cy="32" r="4" fill="currentColor" />
                          <path d="M16 32 L24 24 L32 24 L40 28 L32 32" stroke="currentColor" strokeWidth="2" fill="none" />
                          <path d="M32 24 L36 20" stroke="currentColor" strokeWidth="2" />
                          <circle cx="37" cy="19" r="2" fill="currentColor" />
                          <rect x="42" y="22" width="6" height="4" rx="1" fill="currentColor" />
                        </svg>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs">📦</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Become a Dasher</h3>
                    <p className="text-gray-600 mb-4">As a delivery driver, make money and work on your schedule. Sign up in minutes.</p>
                    <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">Start earning →</a>
                  </div>

                  {/* Become a Merchant */}
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center relative">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-blue-600">
                          <rect x="12" y="20" width="24" height="20" rx="2" fill="currentColor" />
                          <rect x="16" y="24" width="4" height="8" fill="white" />
                          <rect x="24" y="24" width="4" height="8" fill="white" />
                          <rect x="20" y="32" width="8" height="2" fill="white" />
                          <path d="M18 20 L18 16 L30 16 L30 20" stroke="currentColor" strokeWidth="2" fill="none" />
                          <rect x="20" y="12" width="8" height="4" fill="currentColor" />
                        </svg>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs">🏪</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Become a Merchant</h3>
                    <p className="text-gray-600 mb-4">Attract new customers and grow sales, starting with 0% commissions for up to 30 days.</p>
                    <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">Sign up for NDAJE →</a>
                  </div>

                  {/* Get the best experience */}
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center relative">
                        <svg width="32" height="48" viewBox="0 0 32 48" fill="none" className="text-blue-600">
                          <rect x="6" y="4" width="20" height="36" rx="4" fill="currentColor" />
                          <rect x="8" y="8" width="16" height="24" fill="white" />
                          <circle cx="16" cy="36" r="2" fill="white" />
                        </svg>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs">📱</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Get the best NDAJE experience</h3>
                    <p className="text-gray-600 mb-4">Experience the best your neighborhood has to offer, all in one app.</p>
                    <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">Get the app →</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip on white */}
      <section className="bg-white text-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">For Hotels</h3>
              <p className="text-gray-600">Easy ordering, inventory management, and reliable delivery.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">For Suppliers</h3>
              <p className="text-gray-600">Reach more hotels and manage orders efficiently.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">For Managers</h3>
              <p className="text-gray-600">Monitor operations and optimize your supply chain.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {(showLogin || showSignup) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full mx-4 relative max-h-[80vh] overflow-y-auto">
            <button 
              onClick={() => {
                setShowLogin(false)
                setShowSignup(false)
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <h2 className="text-0xl font-bold text-center mb-2 text-gray-900">
              Sign in or Sign up
            </h2>

            {/* Toggle buttons for Sign In/Sign Up */}
            <div className="flex rounded-[100px] bg-gray-100 p-0 mb-1">
              <button 
                onClick={() => {
                  setShowLogin(true)
                  setShowSignup(false)
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  showLogin ? 'bg-blue-900 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  setShowLogin(false)
                  setShowSignup(true)
                }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  showSignup ? 'bg-blue-900 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {showSignup ? (
              <form className="space-y-4">
                {/* Name fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[15px] font-bold text-gray-900 mb-1 block">
                     First Name
                    </label>
                    <input
                      type="text"
                       className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-0 focus:ring-black-[500px] focus:border-black-[500px] text-gray-900" 
                      required
                    />
                    
                  </div>
                  <div>
                     <label className="text-[15px] font-bold text-gray-900 mb-1 block">
                       Last Name
                       </label>
                    <input
                      type="text"
                      className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-0 focus:ring-black-[500px] focus:border-black-[500px] text-gray-900" 
                      required
                    />
              
                  </div>
                </div>

                {/* Email field */}
                <label className="text-[15px] font-bold text-gray-900 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                 
                 className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-4 focus:ring-black-[500px] focus:border-black-[500px] text-gray-900"
                  required
                />

                {/* Mobile Number field */}
                <div>
                  <label className="text-[15px] font-bold text-gray-900 mb-1 block">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <div className="w-[110px]">
                      <select
                        className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900 text-gray-900"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                        {countryOptions.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="tel"
                      className={`flex-1 px-4 py-1 border ${
                        isValid() ? "border-gray-300" : "border-red-500"
                      } rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-gray-900`}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                     
                    />
                  </div>
                 
                </div>

                {/* Password field */}
                <div>
                  <div className="relative">
                    <label className="text-[15px] font-bold text-gray-900 mb-1 block">
                    Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-4 focus:ring-black-[500px] focus:border-black-[500px] text-gray-900"
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  className="w-full bg-red-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-red-700 transition-colors"
                >
                Continue to Sign Up
                </button>
              </form>
            ) : (
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
                <div>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      Show
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-red-700 transition-colors"
                >
                   <a href='/ClientDashboard'>Continue to Sign In</a>
                </button>
              </form>
            )}

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
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                Continue with Apple
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientLanding