import React, { useMemo, useState, useCallback } from 'react'
import {
  DevicePhoneMobileIcon,
  BuildingStorefrontIcon,
  DeviceTabletIcon,
  MapPinIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  UserIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline'
import AsyncSelect from 'react-select/async'
import Logo from '../common/Logo'
import { useAuth } from '../../contexts/AuthContext'

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

function ModernFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo variant="white" className="mb-4" />
            <p className="text-gray-400 mb-4 max-w-md">
              NDAJE is your premier delivery service platform, connecting hotels with reliable suppliers
              across East Africa. Fast, efficient, and professional.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hotel Supplies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Delivery</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Become a Partner</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 NDAJE. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ClientLanding() {
  const { currentUser } = useAuth()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [countryCode, setCountryCode] = useState("+250");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const isValid = () => {
    if (countryCode === "+250") {
      return phone.startsWith("7") && phone.replace(/\D/g, '').length === 9;
    }
    return true;
  };

  // Nominatim (OpenStreetMap) search - no API key required
  const loadPlaceOptions = useCallback(async (input) => {
    if (!input || input.length < 2) return [];
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=jsonv2&addressdetails=1&limit=6`
      );
      const data = await res.json();
      return data.map(item => ({
        label: item.display_name,
        value: item.place_id,
        coordinates: [parseFloat(item.lat), parseFloat(item.lon)],
        raw: item,
      }));
    } catch (e) {
      console.error('Place search error', e);
      return [];
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Floating auth buttons */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={() => setShowLogin(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200 border border-white/20"
          aria-label="Sign in"
        >
          <UserIcon className="w-5 h-5" />
          <span className="font-medium text-sm">Sign In</span>
        </button>
        <button
          onClick={() => setShowSignup(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-blue-900 hover:bg-gray-100 transition-all duration-200 shadow-lg"
          aria-label="Sign up"
        >
          <UserPlusIcon className="w-5 h-5" />
          <span className="font-semibold text-sm">Sign Up</span>
        </button>
      </div>

      {/* Centered logo */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
        <Logo variant="white" className="scale-90" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Decorative images (visible on mobile & desktop, positioned responsively) */}
        <div className="absolute inset-0 pointer-events-none">
          <img src={LandingImage7} alt="" className="absolute left-0 bottom-0 w-40 sm:w-56 md:w-80 opacity-90 rounded-2xl transform -translate-x-6 -translate-y-4" />
          <img src={LandingImage00} alt="" className="absolute right-0 bottom-8 w-40 sm:w-56 md:w-96 opacity-90 rounded-2xl translate-x-6" />
          <img src={LandingImage2} alt="" className="absolute left-2 top-6 w-28 sm:w-44 md:w-64 opacity-70 rounded-2xl rotate-12" />
          <img src={mobile} alt="" className="absolute left-1/2 top-32 w-20 sm:w-28 md:w-44 opacity-90 -translate-x-1/2 rotate-[-12deg]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-indigo-900/30 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 text-white drop-shadow-lg leading-tight">
            0 RWF DELIVERY FEE
            <span className="block text-lg sm:text-xl font-medium mt-2 opacity-90">ON FIRST ORDER — Fast, reliable delivery for hotels</span>
          </h1>

          {/* Address search using real place search (OpenStreetMap / Nominatim) */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-6 h-6 text-white ml-2 flex-shrink-0" />
                <div className="flex-1">
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadPlaceOptions}
                    onInputChange={(val) => setQuery(val)}
                    onChange={(selected) => {
                      if (selected) {
                        setQuery(selected.label)
                        setSelectedPlace(selected)
                      }
                    }}
                    placeholder="Search a real place or landmark (e.g., Kigali City Tower, Kimihurura)"
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                        minHeight: '36px',
                      }),
                      input: (base) => ({ ...base, color: 'white', fontSize: '1rem' }),
                      singleValue: (base) => ({ ...base, color: 'white' }),
                      placeholder: (base) => ({ ...base, color: 'rgba(255,255,255,0.8)' }),
                      menu: (base) => ({ ...base, zIndex: 60, borderRadius: 12 }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? '#EEF2FF' : 'white',
                        color: '#111827',
                        padding: 12,
                      }),
                    }}
                    menuPlacement="auto"
                    aria-label="Place search"
                  />
                </div>

                <button
                  onClick={() => setShowSignup(true)}
                  className="bg-white text-blue-900 rounded-xl w-12 h-12 grid place-items-center hover:bg-gray-100 shadow-lg transition-all duration-200"
                  aria-label="Open signup"
                >
                  <MapPinIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-6 py-3 text-sm backdrop-blur-sm shadow transition-all duration-200 border border-white/20 inline-flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                Sign in for saved address
              </button>

              <button
                onClick={() => setShowSignup(true)}
                className="bg-white text-blue-900 rounded-xl px-6 py-3 text-sm backdrop-blur-sm shadow transition-all duration-200 inline-flex items-center gap-2"
              >
                <UserPlusIcon className="w-4 h-4" />
                Create account
              </button>
            </div>

            {selectedPlace && (
              <div className="mt-4 text-sm text-white/90 bg-white/5 p-3 rounded-lg">
                Selected: <span className="font-medium">{selectedPlace.label}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <DevicePhoneMobileIcon className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Become a Dasher</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                As a delivery driver, make money and work on your schedule. Sign up in minutes and start earning today.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:gap-3 duration-200">
                Start earning
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BuildingStorefrontIcon className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Become a Partner</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Grow your business with NDAJE. Reach more customers and increase your sales with our delivery platform.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:gap-3 duration-200">
                Partner with us
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <DeviceTabletIcon className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get the App</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Experience the best your neighborhood has to offer, all in one app. Download now for faster ordering.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:gap-3 duration-200">
                Download app
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {(showLogin || showSignup) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-auto relative shadow-2xl">
            <button
              onClick={() => {
                setShowLogin(false)
                setShowSignup(false)
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {showLogin ? 'Welcome Back' : 'Create your NDAJE account'}
              </h2>
              <p className="text-gray-600 mt-1 text-sm">
                {showLogin ? 'Sign in to continue' : 'Sign up to save addresses and order faster'}
              </p>
            </div>

            <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
              <button
                onClick={() => {
                  setShowLogin(true)
                  setShowSignup(false)
                }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  showLogin ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="inline-flex items-center gap-2 justify-center">
                  <UserIcon className="w-4 h-4" /> Sign In
                </div>
              </button>
              <button
                onClick={() => {
                  setShowLogin(false)
                  setShowSignup(true)
                }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  showSignup ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="inline-flex items-center gap-2 justify-center">
                  <UserPlusIcon className="w-4 h-4" /> Sign Up
                </div>
              </button>
            </div>

            {showSignup ? (
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">First Name</label>
                    <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Last Name</label>
                    <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Email</label>
                  <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Mobile Number</label>
                  <div className="flex gap-3">
                    <select
                      className="w-36 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      aria-label="Country code"
                    >
                      {countryOptions.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} — {c.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className={`flex-1 px-3 py-2 border ${isValid() ? 'border-gray-300' : 'border-red-500'} rounded-lg text-gray-900`}
                      placeholder="7XXXXXXXX"
                    />
                  </div>
                  {!isValid() && (
                    <p className="text-red-500 text-sm mt-1">Rwandan numbers must start with 7 and be 9 digits</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 text-gray-900"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">At least 10 characters with numbers and symbols recommended</p>
                </div>

                <p className="text-xs text-gray-600">
                  By creating an account you agree to NDAJE's <a href="#" className="text-blue-600">Terms</a> and <a href="#" className="text-blue-600">Privacy Policy</a>.
                </p>

                <button type="submit" className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2">
                  <UserPlusIcon className="w-4 h-4" /> Create Account
                </button>
              </form>
            ) : (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Email</label>
                  <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 text-gray-900" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2">
                  <UserIcon className="w-4 h-4" /> Sign In
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

            <div className="grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white" aria-label="Continue with Google">
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#EA4335" d="M12 11.5v2.9h4.8c-.2 1.3-.9 2.5-1.9 3.3l3.1 2.4C20.9 20 22 16.9 22 13.5 22 12.8 21.9 12 21.7 11.3H12z"/>
                  <path fill="#34A853" d="M6.5 14.8c-.4-1.2-.4-2.6 0-3.8L3.4 8.6C2.2 10.8 2 13.6 3.4 16.1l3.1-1.3z"/>
                  <path fill="#FBBC05" d="M12 6.5c1.2 0 2.3.4 3.1 1.2l2.3-2.3C16.6 3.4 14.4 2.5 12 2.5 9.7 2.5 7.6 3.4 5.9 4.8l3.1 2.2C9.5 6.8 10.7 6.5 12 6.5z"/>
                  <path fill="#4285F4" d="M4.5 18.4C6 20 8.8 21 12 21c3 0 5.2-.9 6.8-2.2L15.6 16.5C14.6 17.3 13.3 17.8 12 17.8c-2.1 0-3.8-1-4.8-2.6L4.5 18.4z"/>
                </svg>
                Google
              </button>

              <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white" aria-label="Continue with Facebook">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
                  <path d="M22 12.07C22 6.44 17.52 2 12 2S2 6.44 2 12.07c0 5 3.66 9.14 8.44 9.88v-6.99H8.44v-2.89h2V9.4c0-2 1.2-3.1 3-3.1.86 0 1.76.15 1.76.15v1.95h-1c-1 0-1.2.58-1.2 1.18v1.45h2.04l-.33 2.89h-1.71v6.99C18.34 21.21 22 17.07 22 12.07z"/>
                </svg>
                Facebook
              </button>

              <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white" aria-label="Continue with Apple">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000" aria-hidden>
                  <path d="M16.365 1.43c-.91.05-2.05.61-2.71 1.22-.59.55-1.18 1.44-1.04 2.29 1.12.05 2.28-.6 3.01-1.2.63-.52 1.17-1.34.74-2.31zM12 6.8c-2.92 0-3.68 2.22-5.35 2.22-1.84 0-2.9-2.12-4.8-2.12-2.5 0-4.5 2.36-4.5 6.3 0 3.87 1.94 6.9 4.82 6.9 1.58 0 2.42-1.01 4.55-1.01 2.12 0 2.83 1.01 4.58 1.01 2.94 0 4.88-3.03 4.88-6.91 0-4.1-2.64-5.98-4.94-5.98-1.97 0-3.01 1.21-4.69 1.21z"/>
                </svg>
                Apple
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Footer */}
      <ModernFooter />
    </div>
  )
}

export default ClientLanding