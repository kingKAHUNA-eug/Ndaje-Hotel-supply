import React, { useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../common/Logo'
import { addOrder, getOrders } from '../../utils/demoStore'

// Icons
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckBadgeIcon,
  PlusIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  UserPlusIcon,
  ChevronRightIcon,
  StarIcon,
  ShoppingCartIcon,
  EyeIcon,
  FireIcon
} from '@heroicons/react/24/outline'

function ClientDashboard() {
  const { currentUser } = useAuth()

  const [product, setProduct] = useState('Towels (pack of 50)')
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const orders = useMemo(() => getOrders().filter(o => o.clientId === currentUser?.id), [currentUser])

  const requestQuote = () => {
    if (!address) return alert('Please enter delivery address')
    addOrder({
      clientId: currentUser?.id,
      clientName: currentUser?.name,
      product,
      quantity,
      address,
      deliveryDate,
      specialInstructions,
      status: 'quote_requested',
      paymentStatus: 'pending_quote',
      type: 'quote'
    })
    setShowQuoteModal(false)
    // Reset form
    setProduct('Towels (pack of 50)')
    setQuantity(1)
    setAddress('')
    setDeliveryDate('')
    setSpecialInstructions('')
  }

  // Product categories
  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️', count: 156 },
    { id: 'toiletries', name: 'Toiletries', icon: '🧴', count: 42 },
    { id: 'linens', name: 'Bed & Bath', icon: '🛏️', count: 38 },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹', count: 27 },
    { id: 'amenities', name: 'Amenities', icon: '🚽', count: 31 },
    { id: 'dining', name: 'Dining', icon: '🍽️', count: 18 }
  ]

  // Sample products data
  const products = [
    {
      id: 1,
      name: 'Premium Bath Towels',
      description: '100% cotton, 600 GSM, luxury hotel quality',
      price: '45,000 RWF',
      unit: 'per pack of 10',
      image: '🛁',
      category: 'linens',
      rating: 4.8,
      reviews: 124,
      minOrder: 5,
      delivery: '2-3 days'
    },
    {
      id: 2,
      name: 'Eco Shampoo Bottles',
      description: 'Biodegradable, 200ml, various scents available',
      price: '28,000 RWF',
      unit: 'per box of 50',
      image: '🧴',
      category: 'toiletries',
      rating: 4.6,
      reviews: 89,
      minOrder: 2,
      delivery: '1-2 days'
    },
    {
      id: 3,
      name: 'Professional Cleaning Kit',
      description: 'Complete set for hotel room maintenance',
      price: '120,000 RWF',
      unit: 'per kit',
      image: '🧹',
      category: 'cleaning',
      rating: 4.9,
      reviews: 67,
      minOrder: 1,
      delivery: '3-4 days'
    },
    {
      id: 4,
      name: 'Luxury Bath Amenities',
      description: 'Soap, shampoo, conditioner & lotion set',
      price: '35,000 RWF',
      unit: 'per set of 4',
      image: '🧼',
      category: 'amenities',
      rating: 4.7,
      reviews: 156,
      minOrder: 10,
      delivery: '2 days'
    },
    {
      id: 5,
      name: 'Ceramic Dinnerware Set',
      description: 'Elegant white ceramic, restaurant quality',
      price: '85,000 RWF',
      unit: 'per set of 12',
      image: '🍽️',
      category: 'dining',
      rating: 4.5,
      reviews: 78,
      minOrder: 3,
      delivery: '4-5 days'
    },
    {
      id: 6,
      name: 'Hotel Bed Linens',
      description: '300 thread count, king size sheets',
      price: '65,000 RWF',
      unit: 'per set',
      image: '🛏️',
      category: 'linens',
      rating: 4.8,
      reviews: 203,
      minOrder: 4,
      delivery: '3 days'
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
      {/* Enhanced Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Logo className="h-8 w-auto" />
              
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-2xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search hotel supplies, amenities, equipment..."
                />
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-3">
              <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all duration-200">
                <MapPinIcon className="w-4 h-4" />
                <span className="font-medium">Kigali</span>
                <ChevronRightIcon className="w-3 h-3" />
              </button>
              
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-200">
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition-all duration-200">
                  <UserPlusIcon className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* Quick Stats Banner */}
        <div className="bg-blue-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-blue-100 text-sm">Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-blue-100 text-sm">Suppliers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24h</div>
                <div className="text-blue-100 text-sm">Quote Response</div>
              </div>
              <div>
                <div className="text-2xl font-bold">98%</div>
                <div className="text-blue-100 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories & Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group ${
                          selectedCategory === category.id 
                            ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{category.icon}</span>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            selectedCategory === category.id ? 'text-blue-700' : 'text-gray-900'
                          }`}>
                            {category.name}
                          </div>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          selectedCategory === category.id 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowQuoteModal(true)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all duration-200"
                    >
                      <PlusIcon className="w-5 h-5" />
                      <span className="font-medium">Request Quote</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-200">
                      <DocumentTextIcon className="w-5 h-5" />
                      <span className="font-medium">My Quotes</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-200">
                      <TruckIcon className="w-5 h-5" />
                      <span className="font-medium">Track Orders</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Header with Title and Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Hotel Supplies</h1>
                  <p className="text-gray-600 mt-2">Find everything you need for your hotel operations</p>
                </div>
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <select className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                    <option>Sort by: Popular</option>
                    <option>Sort by: Price Low to High</option>
                    <option>Sort by: Price High to Low</option>
                    <option>Sort by: Rating</option>
                  </select>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-sm font-medium">
                    Filter
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                    <div className="p-6">
                      {/* Product Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">{product.image}</div>
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm">
                          <StarIcon className="w-4 h-4" />
                          <span>{product.rating}</span>
                          <span className="text-green-600">({product.reviews})</span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Pricing */}
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-gray-900">{product.price}</div>
                        <div className="text-gray-500 text-sm">{product.unit}</div>
                      </div>

                      {/* Product Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <ShoppingCartIcon className="w-4 h-4" />
                          <span>Min: {product.minOrder}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TruckIcon className="w-4 h-4" />
                          <span>{product.delivery}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setProduct(product.name)
                            setShowQuoteModal(true)
                          }}
                          className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                          Get Quote
                        </button>
                        <button className="p-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View All
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Quotes */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                      Recent Quote Requests
                    </h3>
                    <div className="space-y-3">
                      {orders.filter(o => o.type === 'quote').slice(0, 2).map(order => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-gray-900 text-sm">{order.product}</span>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Pending</span>
                          </div>
                          <div className="text-xs text-gray-600 mb-1">Qty: {order.quantity}</div>
                          <div className="text-xs text-gray-500">Submitted: Today</div>
                        </div>
                      ))}
                      {orders.filter(o => o.type === 'quote').length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          No quote requests yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TruckIcon className="w-5 h-5 text-green-600" />
                      Recent Orders
                    </h3>
                    <div className="space-y-3">
                      {orders.filter(o => o.type !== 'quote').slice(0, 2).map(order => (
                        <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-gray-900 text-sm">{order.product}</span>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Delivered</span>
                          </div>
                          <div className="text-xs text-gray-600 mb-1">Qty: {order.quantity}</div>
                          <div className="text-xs text-gray-500">Placed: 2 days ago</div>
                        </div>
                      ))}
                      {orders.filter(o => o.type !== 'quote').length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          No orders placed yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-auto relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
              Request Quote
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Get competitive pricing from verified suppliers
            </p>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product
                  </label>
                  <select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  >
                    <option>Towels (pack of 50)</option>
                    <option>Bed Sheets (pack of 20)</option>
                    <option>Shampoo Bottles (box of 100)</option>
                    <option>Toilet Paper Rolls (box of 60)</option>
                    <option>Cleaning Supplies Kit</option>
                    <option>Minibar Items Bundle</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Address
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  placeholder="Enter your hotel address for delivery"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Delivery Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all pl-10"
                    />
                    <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all">
                    <option>Not specified</option>
                    <option>50,000 - 100,000 RWF</option>
                    <option>100,000 - 500,000 RWF</option>
                    <option>500,000 - 1,000,000 RWF</option>
                    <option>1,000,000+ RWF</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                  placeholder="Any specific requirements, brands, or quality standards..."
                />
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckBadgeIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800">
                      Your quote request will be sent to multiple verified suppliers. You'll receive competitive offers within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={requestQuote}
                  className="flex-1 bg-blue-600 text-white rounded-xl px-6 py-4 font-semibold hover:bg-blue-700 transition-colors shadow-lg inline-flex items-center justify-center gap-2"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  Request Quotes
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientDashboard