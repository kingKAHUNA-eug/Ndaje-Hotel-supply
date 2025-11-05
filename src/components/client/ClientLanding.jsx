import React, { useMemo, useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { 
  DevicePhoneMobileIcon,
  BuildingStorefrontIcon,
  DeviceTabletIcon,
  MapPinIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  UserIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'
import Select from 'react-select'
import Logo from '../common/Logo'
import { useAuth } from '../../contexts/AuthContext'
import { signInWithGoogle } from '../../firebase' // ← WORKS NOW
import { useNavigate } from 'react-router-dom';
// Image imports
import LandingImage7 from '../../assets/images/LandingImage_7.png'
import LandingImage00 from '../../assets/images/LandingImage_00.png'
import LandingImage2 from '../../assets/images/LandingImage_2.png'
import mobile from '../../assets/images/mobile.png'

// Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const countryOptions = [
  { code: "+250", name: "Rwanda", flag: "Rwanda" },
  { code: "+254", name: "Kenya", flag: "Kenya" },
  { code: "+255", name: "Tanzania", flag: "Tanzania" },
  { code: "+256", name: "Uganda", flag: "Uganda" },
  { code: "+27", name: "South Africa", flag: "South Africa" },
  { code: "+1", name: "USA", flag: "USA" },
  { code: "+44", name: "UK", flag: "UK" },
  { code: "+91", name: "India", flag: "India" },
];

// Real location data for Rwanda
const rwandaLocations = [
  { value: 'downtown-kigali', label: 'Downtown, Kigali', coordinates: [-1.9536, 30.0605] },
  { value: 'kimironko', label: 'Kimironko, Kigali', coordinates: [-1.9441, 30.1301] },
  { value: 'gikondo', label: 'Gikondo, Kigali', coordinates: [-1.9786, 30.0865] },
  { value: 'nyamirambo', label: 'Nyamirambo, Kigali', coordinates: [-1.9667, 30.0500] },
  { value: 'kicukiro', label: 'Kicukiro, Kigali', coordinates: [-1.9696, 30.1333] },
  { value: 'nyarugenge', label: 'Nyarugenge, Kigali', coordinates: [-1.9536, 30.0605] },
  { value: 'gasabo', label: 'Gasabo, Kigali', coordinates: [-1.9444, 30.0618] },
  { value: 'remera', label: 'Remera, Kigali', coordinates: [-1.9500, 30.1167] },
  { value: 'kacyiru', label: 'Kacyiru, Kigali', coordinates: [-1.9444, 30.0944] },
  { value: 'gisozi', label: 'Gisozi, Kigali', coordinates: [-1.9361, 30.0944] },
];

function LocationMap({ onLocationSelect, selectedLocation }) {
  const [position, setPosition] = useState(selectedLocation || [-1.9706, 30.1044]); // Kigali center

  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={position}
      zoom={12}
      style={{ height: '300px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} />
      <MapClickHandler />
    </MapContainer>
  );
}

function ModernFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Logo variant="white" className="mb-4" />
            <p className="text-gray-400 mb-4 max-w-md">
              NDAJE is your premier delivery service platform, connecting hotels with reliable suppliers 
              across East Africa. Fast, efficient, and professional.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
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
            © 2024 NDAJE. All rights reserved.
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
 const navigate = useNavigate();     
  const { currentUser } = useAuth();  
  const [query, setQuery] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const suggestions = useMemo(() => {
    if (!query) return rwandaLocations.slice(0, 4);
    return rwandaLocations
      .filter(x => x.label.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }, [query]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowMap(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Floating auth buttons */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        <button 
          onClick={() => setShowLogin(true)} 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200 border border-white/20"
        >
          <UserIcon className="w-4 h-4" />
          <span className="font-medium">Sign In</span>
        </button>
        <button 
          onClick={() => setShowSignup(true)} 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-blue-900 hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <UserPlusIcon className="w-4 h-4" />
          <span className="font-semibold">Sign Up</span>
        </button>
      </div>
      
      {/* Centered logo */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
        <Logo variant="white" className="scale-90" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Desktop Images */}
          <div className="hidden lg:block">
            <img src={LandingImage7} alt="LandingImage_7" className="pointer-events-none select-none absolute left-[-80px] bottom-[-35px] w-110 rounded-3xl opacity-100 z-10 shadow-2xl" />
            <img src={LandingImage00} alt="LandingImage_00" className="pointer-events-none select-none absolute right-[-75px] bottom-[30px] w-130 rounded-3xl opacity-100 z-0 shadow-2xl" />
            <img src={LandingImage2} alt="LandingImage_2" className="pointer-events-none select-none absolute left-[-110px] top-[0px] w-130 rounded-3xl rotate-[45deg] opacity-100 z-0 shadow-2xl" />
            <img src={mobile} alt="mobile" className="pointer-events-none select-none absolute left-[160px] bottom-[-10px] w-72 rounded-3xl rotate-[-15deg] opacity-100 z-0 shadow-2xl" />
          </div>
          
          {/* Mobile Background Pattern */}
          <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-blue-800/50 to-indigo-800/50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg">
            0 RWF DELIVERY FEE<br />ON FIRST ORDER
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 text-blue-100 font-light">
            Fast, reliable delivery for your hotel needs
          </p>

          {/* Enhanced Address Search */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3">
                <MapPinIcon className="w-6 h-6 text-white ml-3" />
                <div className="flex-1">
                  <Select
                    options={rwandaLocations}
                    onInputChange={(value) => setQuery(value)}
                    onChange={(selected) => {
                      if (selected) {
                        setQuery(selected.label);
                        setSelectedLocation(selected.coordinates);
                      }
                    }}
                    placeholder="Enter delivery address"
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: 'transparent',
                        border: 'none',
                        boxShadow: 'none',
                      }),
                      input: (base) => ({
                        ...base,
                        color: 'white',
                        fontSize: '1.125rem',
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '1.125rem',
                      }),
                      menu: (base) => ({
                        ...base,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                      }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                        color: '#1f2937',
                        fontSize: '1rem',
                        padding: '12px 16px',
                      }),
                    }}
                  />
                </div>
                <button 
                  onClick={() => setShowMap(true)}
                  className="bg-white text-blue-900 rounded-xl w-12 h-12 grid place-items-center hover:bg-gray-100 shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <MapPinIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => setShowLogin(true)}
                className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-6 py-3 text-sm backdrop-blur-sm shadow transition-all duration-200 border border-white/20"
              >
                Sign in for saved address
              </button>
              <button 
                onClick={() => setShowMap(true)}
                className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-6 py-3 text-sm backdrop-blur-sm shadow transition-all duration-200 border border-white/20 flex items-center gap-2 justify-center"
              >
                <MapPinIcon className="w-4 h-4" />
                Choose on map
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Become a Dasher */}
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

            {/* Become a Merchant */}
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

            {/* Get the App */}
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

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose NDAJE?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional delivery solutions tailored for hotels and businesses across East Africa
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <BuildingStorefrontIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">For Hotels</h3>
              <p className="text-gray-600 leading-relaxed">
                Streamlined ordering, real-time inventory management, and reliable delivery for all your hotel essentials.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <DevicePhoneMobileIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">For Suppliers</h3>
              <p className="text-gray-600 leading-relaxed">
                Expand your reach to more hotels and manage orders efficiently with our advanced supplier platform.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <MapPinIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-time Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your deliveries in real-time with live tracking and instant notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Choose Delivery Location</h3>
              <button 
                onClick={() => setShowMap(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <LocationMap 
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation}
              />
              <div className="mt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setShowMap(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowMap(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {showLogin ? 'Welcome Back' : 'Join NDAJE'}
              </h2>
              <p className="text-gray-600 mt-2">
                {showLogin ? 'Sign in to your account' : 'Create your account today'}
              </p>
            </div>

            {/* Toggle buttons */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
              <button 
                onClick={() => {
                  setShowLogin(true)
                  setShowSignup(false)
                }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  showLogin 
                    ? 'bg-white text-blue-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  setShowLogin(false)
                  setShowSignup(true)
                }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  showSignup 
                    ? 'bg-white text-blue-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* SIGN IN: Email + Password */}
            {showLogin && (
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  const password = e.target.password.value;

                  try {
                    const res = await fetch('http://localhost:4000/api/auth/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, password }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Login failed');
                     localStorage.setItem('token', data.data.token);
                     navigate('/ClientDashboard'); // ← AUTO REDIRECT
                  } catch (err) {
                    alert(err.message);
                  }
                }}
                className="space-y-6"
              >
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors" 
                />
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                  <input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors pr-12" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white rounded-xl px-4 py-4 font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Sign In
                </button>
              </form>
            )}

            {/* SIGN UP: Full form + Social */}
            {showSignup && (
              <>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    // USE name DIRECTLY — NO firstName/lastName
                       const payload = {
                        name: formData.get('name').trim(),
                        email: formData.get('email'),
                        password: formData.get('password'),
                        phone: formData.get('phone') || undefined,
                  };

                    try {
                      const res = await fetch('http://localhost:4000/api/auth/signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Signup failed');
                      // NO ALERT — SAVE TOKEN + REDIRECT
                      localStorage.setItem('token', data.data.token);
                     navigate('/ClientDashboard'); // ← AUTO REDIRECT
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                      <input name="name" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                    <input name="email" type="email" required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength="6"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-colors pr-12"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 text-white rounded-xl px-4 py-4 font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                    Create Account
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

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={signInWithGoogle}
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>
                  
                  
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modern Footer */}
      <ModernFooter />
    </div>
  )
}

export default ClientLanding;