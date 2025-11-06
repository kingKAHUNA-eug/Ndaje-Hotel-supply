import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../common/Logo'
import { addOrder, getOrders } from '../../utils/demoStore'

// Heroicons
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  TruckIcon,
  CheckBadgeIcon,
  PlusIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  ChevronRightIcon,
  StarIcon,
  ShoppingCartIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  BanknotesIcon,
  CreditCardIcon,
  SparklesIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

// Utility: random friendly bucket name
const ADJECTIVES = ['Sunny', 'Quick', 'Chill', 'Flash', 'Happy', 'Nifty', 'Sly', 'Brisk', 'Merry', 'Jolly']
const NOUNS = ['Bucket', 'Bundle', 'Stack', 'Pile', 'Sack', 'Crate', 'Pack', 'Bundle', 'Cart', 'Chest']
const genName = () => `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`

// Simple currency parse for demo prices like "45,000 RWF"
const parsePrice = (p) => {
  if (!p) return 0
  const n = String(p).replace(/[^\d]/g, '')
  return Number(n) || 0
}
const formatPrice = (n) => {
  return n.toLocaleString() + ' RWF'
}

// Generate unique order code
const generateOrderCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return `NDJ${Array.from({length: 6}, () => chars[Math.floor(Math.random() * chars.length)]).join('')}`
}

// Sample product catalog with detailed images
const products = [
  { 
    id: 1, 
    name: 'Premium Bath Towels', 
    description: '100% cotton, 600 GSM, luxury hotel quality', 
    price: 45000, 
    unit: 'per pack of 10', 
    emoji: '🛁', 
    category: 'linens', 
    rating: 4.8, 
    minOrder: 5, 
    delivery: '2-3 days',
    images: [
      'https://images.unsplash.com/photo-1602020075125-15ecf8230c8f?w=500',
      'https://images.unsplash.com/photo-1584337939954-b8fcf1b837bc?w=500',
      'https://images.unsplash.com/photo-1620830953759-51ece0e1c8d6?w=500'
    ]
  },
  { 
    id: 2, 
    name: 'Eco Shampoo Bottles', 
    description: 'Biodegradable, 200ml, various scents available', 
    price: 28000, 
    unit: 'per box of 50', 
    emoji: '🧴', 
    category: 'toiletries', 
    rating: 4.6, 
    minOrder: 2, 
    delivery: '1-2 days',
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
      'https://images.unsplash.com/photo-1610992019935-19af54d7ae4a?w=500'
    ]
  },
  { 
    id: 3, 
    name: 'Professional Cleaning Kit', 
    description: 'Complete set for hotel room maintenance', 
    price: 120000, 
    unit: 'per kit', 
    emoji: '🧹', 
    category: 'cleaning', 
    rating: 4.9, 
    minOrder: 1, 
    delivery: '3-4 days',
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500',
      'https://images.unsplash.com/photo-1584622650113-1a2e47551b31?w=500'
    ]
  },
  { 
    id: 4, 
    name: 'Luxury Bath Amenities', 
    description: 'Soap, shampoo, conditioner & lotion set', 
    price: 35000, 
    unit: 'per set of 4', 
    emoji: '🧼', 
    category: 'amenities', 
    rating: 4.7, 
    minOrder: 10, 
    delivery: '2 days',
    images: [
      'https://images.unsplash.com/photo-1600857062244-5c0071b6a48b?w=500',
      'https://images.unsplash.com/photo-1544885353-1caa3c8f4a3e?w=500'
    ]
  },
  { 
    id: 5, 
    name: 'Ceramic Dinnerware Set', 
    description: 'Elegant white ceramic, restaurant quality', 
    price: 85000, 
    unit: 'per set of 12', 
    emoji: '🍽️', 
    category: 'dining', 
    rating: 4.5, 
    minOrder: 3, 
    delivery: '4-5 days',
    images: [
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500',
      'https://images.unsplash.com/photo-1572635146182-3c9f3b435c4a?w=500'
    ]
  },
  { 
    id: 6, 
    name: 'Hotel Bed Linens', 
    description: '300 thread count, king size sheets', 
    price: 65000, 
    unit: 'per set', 
    emoji: '🛏️', 
    category: 'linens', 
    rating: 4.8, 
    minOrder: 4, 
    delivery: '3 days',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'
    ]
  }
]

const STORAGE_KEY = 'ndaje_client_buckets_v2'
const ORDER_UPDATES_KEY = 'ndaje_client_order_updates_v2'

function loadBuckets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}
function saveBuckets(b) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(b))
}
function loadOrderUpdates() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_UPDATES_KEY) || '{}')
  } catch {
    return {}
  }
}
function saveOrderUpdates(u) {
  localStorage.setItem(ORDER_UPDATES_KEY, JSON.stringify(u))
}

function ClientDashboard() {
  const { currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [scrollPosition, setScrollPosition] = useState(0)
  const mainRef = useRef(null)

  // Location state
  const [userLocation, setUserLocation] = useState(null)
  const [locationPermission, setLocationPermission] = useState('prompt')

  // Buckets: user creates named buckets (cart-like). persisted in localStorage
  const [buckets, setBuckets] = useState(() => loadBuckets())
  const [activeBucketId, setActiveBucketId] = useState(buckets[0]?.id || null)
  const [creatingBucket, setCreatingBucket] = useState(false)
  const [newBucketName, setNewBucketName] = useState(genName())

  // UI state for add/edit item flows
  const [addQty, setAddQty] = useState(1)
  const [editingBucket, setEditingBucket] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [viewingImages, setViewingImages] = useState(null)

  // Orders & Payment state
  const [orderUpdates, setOrderUpdates] = useState(() => loadOrderUpdates())
  const [viewingBill, setViewingBill] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [processingPayment, setProcessingPayment] = useState(false)

  const rawOrders = useMemo(() => getOrders(), [])
  const orders = useMemo(() => {
    const userOrders = rawOrders.filter(o => o.clientId === currentUser?.id)
    return userOrders.map(o => ({ ...o, ...orderUpdates[o.id] }))
  }, [rawOrders, currentUser, orderUpdates])

  // Get user location
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        console.log('Geolocation is not supported')
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })
          setLocationPermission('granted')
        },
        (error) => {
          console.log('Error getting location:', error)
          setLocationPermission('denied')
        }
      )
    }

    // Only ask for location if permission is not yet decided
    if (locationPermission === 'prompt') {
      getLocation()
    }
  }, [locationPermission])

  // Scroll handling for fixed header
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    saveBuckets(buckets)
  }, [buckets])

  useEffect(() => {
    saveOrderUpdates(orderUpdates)
  }, [orderUpdates])

  // Categories
  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 'toiletries', name: 'Toiletries', icon: '🧴' },
    { id: 'linens', name: 'Bed & Bath', icon: '🛏️' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
    { id: 'amenities', name: 'Amenities', icon: '🚽' },
    { id: 'dining', name: 'Dining', icon: '🍽️' }
  ]

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    return matchesCategory && matchesSearch
  })

  // Bucket helpers
  const createBucket = (name) => {
    const b = { 
      id: `bkt_${Date.now()}`, 
      name: name || genName(), 
      items: [], 
      createdAt: Date.now(), 
      submitted: false, 
      submittedOrderId: null 
    }
    const next = [b, ...buckets]
    setBuckets(next)
    setActiveBucketId(b.id)
    setNewBucketName(genName())
    setCreatingBucket(false)
  }

  const deleteBucket = (id) => {
    const next = buckets.filter(b => b.id !== id)
    setBuckets(next)
    if (activeBucketId === id) setActiveBucketId(next[0]?.id || null)
  }

  const addToBucket = (bucketId, product, qty = 1) => {
    setBuckets(prev => prev.map(b => {
      if (b.id !== bucketId) return b
      const existing = b.items.find(it => it.productId === product.id)
      if (existing) {
        existing.qty += qty
      } else {
        b.items.push({ 
          productId: product.id, 
          name: product.name, 
          price: product.price, 
          qty, 
          unit: product.unit,
          emoji: product.emoji 
        })
      }
      return { ...b, items: [...b.items] }
    }))
  }

  const updateBucketItem = (bucketId, productId, payload) => {
    setBuckets(prev => prev.map(b => {
      if (b.id !== bucketId) return b
      const items = b.items.map(it => it.productId === productId ? { ...it, ...payload } : it)
      return { ...b, items }
    }))
  }

  const removeBucketItem = (bucketId, productId) => {
    setBuckets(prev => prev.map(b => {
      if (b.id !== bucketId) return b
      const items = b.items.filter(it => it.productId !== productId)
      return { ...b, items }
    }))
  }

  const bucketSubtotal = (bucket) => {
    if (!bucket) return 0
    return bucket.items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0)
  }

  // Submit bucket as a quote request
  const submitBucket = (bucketId, meta = {}) => {
    const bucket = buckets.find(b => b.id === bucketId)
    if (!bucket || bucket.items.length === 0) return alert('Bucket is empty')
    
    const orderPayload = {
      clientId: currentUser?.id,
      clientName: currentUser?.name,
      items: bucket.items,
      bucketName: bucket.name,
      subtotal: bucketSubtotal(bucket),
      status: 'quote_requested',
      paymentStatus: 'pending_quote',
      type: 'quote',
      createdAt: new Date().toISOString(),
      orderCode: generateOrderCode(),
      meta
    }
    
    const order = addOrder(orderPayload)
    setBuckets(prev => prev.map(b => b.id === bucketId ? { 
      ...b, 
      submitted: true, 
      submittedOrderId: order.id 
    } : b))
    
    alert('Quote request submitted. Suppliers will respond soon.')
  }

  // Simulate admin sending a bill
  const simulateAdminBill = (orderId, amount) => {
    const orderCode = generateOrderCode()
    setOrderUpdates(prev => ({
      ...prev,
      [orderId]: { 
        ...(prev[orderId] || {}), 
        status: 'billed', 
        billAmount: amount, 
        paymentStatus: 'unpaid',
        orderCode,
        billedAt: new Date().toISOString()
      }
    }))
  }

  // View bill details
  const viewBill = (order) => {
    setViewingBill(order)
  }

  // Process payment
  const processPayment = async (orderId) => {
    setProcessingPayment(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setOrderUpdates(prev => ({
      ...prev,
      [orderId]: { 
        ...(prev[orderId] || {}), 
        paymentStatus: 'paid', 
        paidAt: new Date().toISOString(), 
        status: 'accepted' 
      }
    }))
    
    setProcessingPayment(false)
    setViewingBill(null)
    setPaymentDetails({ cardNumber: '', expiry: '', cvv: '', name: '' })
    alert('Payment successful! Your order is now being processed.')
  }

  // UI helpers
  const activeBucket = buckets.find(b => b.id === activeBucketId) || null
  const isScrolled = scrollPosition > 100

  const handleAddToActive = (product) => {
    if (!activeBucket) {
      setCreatingBucket(true)
      setNewBucketName(genName())
      return
    }
    addToBucket(activeBucket.id, product, addQty || 1)
    setAddQty(1)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const requestLocationPermission = () => {
    setLocationPermission('prompt')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white text-gray-900" ref={mainRef}>
      {/* Location Banner */}
      {locationPermission === 'prompt' && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white p-3 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-sm">We need your location </span>
            <button 
              onClick={requestLocationPermission}
              className="ml-4 px-4 py-1 bg-white text-blue-600 rounded-lg text-sm font-medium"
            >
              Allow
            </button>
          </div>
        </div>
      )}

      {/* Fixed Top Navigation */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'
      } ${locationPermission === 'prompt' ? 'mt-10' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo className="h-8 w-auto" />
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-semibold text-blue-900">NDAJE</span>
                <span className="text-xs text-gray-500">Hotel Supplies & Quotes</span>
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-transparent rounded-2xl bg-white shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200 text-sm"
                  placeholder="Search supplies, towels, shampoo, dinnerware..."
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                <MapPinIcon className="w-4 h-4" />
                <span className="font-medium">
                  {userLocation ? 'Location Found' : 'Detecting Location...'}
                </span>
                <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Bucket Bar */}
        <div className={`border-b border-blue-100 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-3'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Buckets:</span>
              <button
                onClick={() => { setCreatingBucket(true); setNewBucketName(genName()) }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 text-blue-900 border border-blue-100 hover:bg-blue-100"
              >
                <PlusIcon className="w-4 h-4" /> New Bucket
              </button>
            </div>

            <div className="flex items-center gap-3 ml-3">
              {buckets.length === 0 && (
                <div className="text-sm text-gray-500">No buckets yet. Create one to start collecting items.</div>
              )}
              {buckets.map(b => (
                <button
                  key={b.id}
                  onClick={() => setActiveBucketId(b.id)}
                  className={`px-4 py-2 rounded-full min-w-[160px] text-sm flex items-center justify-between gap-3 transition-all ${
                    activeBucketId === b.id 
                      ? 'bg-blue-900 text-white shadow-lg' 
                      : 'bg-white border border-blue-100 text-blue-900 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <SparklesIcon className={`w-4 h-4 ${activeBucketId === b.id ? 'text-white/90' : 'text-blue-600'}`} />
                    <div className="text-left">
                      <div className="font-medium truncate max-w-[100px]">{b.name}</div>
                      <div className="text-xs opacity-80">
                        {b.items.length} items • {b.submitted ? 'Submitted' : 'Draft'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingBucket(b); }} 
                      className={`p-1 rounded-full ${activeBucketId === b.id ? 'bg-white/10' : 'hover:bg-gray-50'}`}
                      title="Edit bucket"
                    >
                      <PencilSquareIcon className={`w-4 h-4 ${activeBucketId === b.id ? 'text-white' : 'text-blue-700'}`} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteBucket(b.id) }} 
                      className="p-1 rounded-full hover:bg-red-50"
                      title="Delete bucket"
                    >
                      <TrashIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className={`h-28 ${locationPermission === 'prompt' ? 'mt-10' : ''}`}></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-32">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Filters</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Category</label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)} 
                    className="mt-2 w-full px-3 py-2 rounded-xl border border-gray-200"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600">Quick Actions</label>
                  <div className="mt-3 grid gap-2">
                    <button onClick={() => setCreatingBucket(true)} className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 text-blue-800">
                      <PlusIcon className="w-4 h-4" /> Create Bucket
                    </button>
                    <button className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200">
                      <DocumentTextIcon className="w-4 h-4 text-blue-700" /> My Quotes
                    </button>
                    <button className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200">
                      <TruckIcon className="w-4 h-4 text-green-600" /> Track Orders
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-sm text-gray-500">Active Bucket</h4>
                  {activeBucket ? (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-900">{activeBucket.name}</div>
                      <div className="text-sm text-blue-700">{activeBucket.items.length} items</div>
                      <div className="text-sm font-semibold">{formatPrice(bucketSubtotal(activeBucket))}</div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600 mt-2">No active bucket selected</p>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Supplies Catalog</h1>
                <p className="text-sm text-gray-600">Create buckets and assemble quotes quickly</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-gray-200">
                  <ShoppingCartIcon className="w-5 h-5 text-blue-700" />
                  <div className="text-sm font-medium">
                    {activeBucket ? `${activeBucket.items.length} items • ${formatPrice(bucketSubtotal(activeBucket))}` : 'No active bucket'}
                  </div>
                </div>
                <button 
                  onClick={() => setEditingBucket(activeBucket)} 
                  disabled={!activeBucket} 
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-60"
                >
                  <DocumentTextIcon className="w-4 h-4" /> Edit Bucket
                </button>
                <button 
                  onClick={() => activeBucket && submitBucket(activeBucket.id)} 
                  disabled={!activeBucket || activeBucket.items.length === 0 || activeBucket.submitted} 
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-blue-200 text-blue-900 hover:shadow"
                >
                  <BanknotesIcon className="w-4 h-4" /> Submit Quote
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <article key={p.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{p.emoji}</div>
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm">
                      <StarIcon className="w-4 h-4" /> {p.rating}
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg text-blue-900 mt-4">{p.name}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">{p.description}</p>

                  {/* View Images Button */}
                  <div className="mt-3">
                    <button 
                      onClick={() => setViewingImages(p)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                    >
                      <PhotoIcon className="w-4 h-4" />
                      View Images
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold text-gray-900">{formatPrice(p.price)}</div>
                      <div className="text-xs text-gray-500">{p.unit}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          min="1" 
                          value={addQty} 
                          onChange={(e) => setAddQty(Math.max(1, Number(e.target.value || 1)))} 
                          className="w-20 px-2 py-1 border rounded-lg text-sm" 
                        />
                        <button 
                          onClick={() => handleAddToActive(p)} 
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800"
                        >
                          <PlusIcon className="w-4 h-4" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Orders / Activity */}
            <div className="mt-12">
              <h2 className="text-xl font-bold text-blue-900 mb-6">My Quotes & Orders</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {orders.length === 0 && (
                  <div className="col-span-2 text-gray-600 p-8 bg-white rounded-2xl shadow text-center">
                    <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p>No orders or quotes yet.</p>
                    <p className="text-sm mt-2">Create a bucket and submit it as a quote request to get started.</p>
                  </div>
                )}
                {orders.map(o => (
                  <div key={o.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <ClipboardDocumentIcon className="w-4 h-4" />
                          Quote • {o.bucketName || 'Bucket'}
                        </div>
                        <div className="font-semibold text-gray-900 text-lg">{o.bucketName || 'Bucket ' + (o.id)}</div>
                        {o.orderCode && (
                          <div className="text-sm text-blue-600 font-mono mt-1">#{o.orderCode}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{new Date(o.createdAt || Date.now()).toLocaleDateString()}</div>
                        <div className={`text-xs mt-1 inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                          o.status === 'billed' ? 'bg-yellow-100 text-yellow-800' : 
                          o.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                          o.status === 'quote_requested' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {o.status?.replace('_', ' ') || 'pending'}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 text-sm text-gray-700 space-y-2">
                      {o.items?.slice(0, 3).map(it => (
                        <div key={it.productId} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span>{it.emoji}</span>
                            <span>{it.name} x{it.qty}</span>
                          </div>
                          <div>{formatPrice(it.price * it.qty)}</div>
                        </div>
                      ))}
                      {o.items?.length > 3 && (
                        <div className="text-xs text-gray-400 mt-1">+{o.items.length - 3} more items</div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-sm text-gray-500">Total Amount</div>
                        <div className="font-semibold text-gray-900 text-lg">
                          {o.billAmount ? formatPrice(o.billAmount) : formatPrice(o.subtotal || 0)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {o.status === 'quote_requested' && (
                          <button 
                            onClick={() => simulateAdminBill(o.id, Math.max(1, Math.round((o.subtotal || 0) * 1.08)))} 
                            className="px-4 py-2 rounded-xl bg-yellow-500 text-white text-sm hover:bg-yellow-600"
                          >
                            Simulate Bill
                          </button>
                        )}

                        {o.status === 'billed' && (
                          <>
                            <button 
                              onClick={() => viewBill(o)}
                              className="px-4 py-2 rounded-xl border border-blue-200 text-blue-700 text-sm hover:bg-blue-50"
                            >
                              View Bill
                            </button>
                            <button 
                              onClick={() => viewBill(o)}
                              className="px-4 py-2 rounded-xl bg-blue-900 text-white text-sm hover:bg-blue-800"
                            >
                              <CreditCardIcon className="w-4 h-4 inline mr-1" /> Pay Now
                            </button>
                          </>
                        )}

                        {o.paymentStatus === 'paid' && (
                          <div className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-xl">
                            <CheckBadgeIcon className="w-4 h-4" /> Paid
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Create Bucket Modal */}
      {creatingBucket && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Create a Bucket</h3>
            <p className="text-sm text-gray-600 mb-4">Give it a simple name to recognise later.</p>
            <input 
              value={newBucketName} 
              onChange={(e) => setNewBucketName(e.target.value)} 
              className="w-full px-4 py-3 border rounded-xl mb-4"
              placeholder="Enter bucket name..."
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setCreatingBucket(false)} className="px-4 py-2 rounded-xl border">Cancel</button>
              <button onClick={() => createBucket(newBucketName)} className="px-4 py-2 rounded-xl bg-blue-900 text-white">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bucket Drawer */}
      {editingBucket && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-900">{editingBucket.name}</h3>
                <div className="text-sm text-gray-500">{editingBucket.items.length} items</div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { deleteBucket(editingBucket.id); setEditingBucket(null) }} 
                  className="px-3 py-2 rounded-xl text-red-600 border border-red-100 hover:bg-red-50"
                >
                  Delete
                </button>
                <button 
                  onClick={() => setEditingBucket(null)} 
                  className="px-3 py-2 rounded-xl bg-blue-900 text-white"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {editingBucket.items.length === 0 && (
                <div className="text-gray-600 text-center py-8">No items yet. Add from the catalog.</div>
              )}
              {editingBucket.items.map(it => (
                <div key={it.productId} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{it.emoji}</span>
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-gray-500">{it.unit}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number" 
                      min="1" 
                      value={it.qty} 
                      onChange={(e) => updateBucketItem(editingBucket.id, it.productId, { qty: Math.max(1, Number(e.target.value || 1)) })} 
                      className="w-20 px-3 py-2 border rounded-lg text-center" 
                    />
                    <div className="text-sm font-medium w-24 text-right">{formatPrice(it.price * it.qty)}</div>
                    <button 
                      onClick={() => removeBucketItem(editingBucket.id, it.productId)} 
                      className="p-2 rounded-lg hover:bg-red-50 transition"
                    >
                      <TrashIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Subtotal</div>
                  <div className="text-xl font-semibold">{formatPrice(bucketSubtotal(editingBucket))}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { submitBucket(editingBucket.id); setEditingBucket(null) }} 
                    disabled={editingBucket.items.length === 0 || editingBucket.submitted} 
                    className="px-6 py-3 rounded-xl bg-blue-900 text-white disabled:opacity-60"
                  >
                    Submit Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Images Modal */}
      {viewingImages && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-blue-900">{viewingImages.name}</h3>
                <p className="text-gray-600 mt-2">{viewingImages.description}</p>
              </div>
              <button 
                onClick={() => setViewingImages(null)} 
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {viewingImages.images.map((img, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={img} 
                    alt={`${viewingImages.name} - Image ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setViewingImages(null)}
                className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800"
              >
                Close Images
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bill View & Payment Modal */}
      {viewingBill && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-blue-900">Invoice</h3>
                <div className="text-sm text-gray-500 mt-2">
                  Order #: <span className="font-mono text-blue-700">{viewingBill.orderCode}</span>
                </div>
              </div>
              <button 
                onClick={() => setViewingBill(null)} 
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Bill Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Bill From</h4>
                <div className="text-sm text-gray-600">
                  <div>NDAJE Suppliers</div>
                  <div>Kigali, Rwanda</div>
                  <div>contact@ndaje.rw</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Bill To</h4>
                <div className="text-sm text-gray-600">
                  <div>{currentUser?.name || 'Client'}</div>
                  <div>{currentUser?.email || 'client@example.com'}</div>
                  <div>Billed on: {new Date(viewingBill.billedAt || Date.now()).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border rounded-lg overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Item</th>
                    <th className="text-right p-3 text-sm font-medium">Quantity</th>
                    <th className="text-right p-3 text-sm font-medium">Price</th>
                    <th className="text-right p-3 text-sm font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingBill.items?.map((it, index) => (
                    <tr key={it.productId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span>{it.emoji}</span>
                          <span>{it.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-right">{it.qty}</td>
                      <td className="p-3 text-sm text-right">{formatPrice(it.price)}</td>
                      <td className="p-3 text-sm text-right font-medium">{formatPrice(it.price * it.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-sm text-gray-600">
                <div>Order Code: <strong className="font-mono">{viewingBill.orderCode}</strong></div>
                <button 
                  onClick={() => copyToClipboard(viewingBill.orderCode)}
                  className="text-blue-600 hover:text-blue-800 text-xs mt-1"
                >
                  Copy to clipboard
                </button>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">
                  {formatPrice(viewingBill.billAmount || viewingBill.subtotal || 0)}
                </div>
                <div className="text-sm text-gray-500">Total Amount</div>
              </div>
            </div>

            {/* Payment Form */}
            {viewingBill.paymentStatus === 'unpaid' && (
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Payment Details</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails(prev => ({...prev, cardNumber: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={paymentDetails.name}
                      onChange={(e) => setPaymentDetails(prev => ({...prev, name: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={paymentDetails.expiry}
                      onChange={(e) => setPaymentDetails(prev => ({...prev, expiry: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={(e) => setPaymentDetails(prev => ({...prev, cvv: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <button
                  onClick={() => processPayment(viewingBill.id)}
                  disabled={processingPayment || !paymentDetails.cardNumber || !paymentDetails.name || !paymentDetails.expiry || !paymentDetails.cvv}
                  className="w-full py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingPayment ? 'Processing...' : `Pay ${formatPrice(viewingBill.billAmount || viewingBill.subtotal || 0)}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientDashboard