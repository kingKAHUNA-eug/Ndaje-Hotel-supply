import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../common/Logo'
import API_BASE_URL from '../../config/api'
import axios from 'axios'

import {
  MagnifyingGlassIcon,
  PlusIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  TrashIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

// Toast Notification Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800'
  }

  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-600" />,
    error: <ExclamationCircleIcon className="w-6 h-6 text-red-600" />,
    info: <InformationCircleIcon className="w-6 h-6 text-blue-600" />,
    warning: <ExclamationCircleIcon className="w-6 h-6 text-yellow-600" />
  }

  return (
    <div className={`fixed top-24 right-6 z-50 max-w-md w-full animate-slide-in-right`}>
      <div className={`${styles[type]} border-l-4 rounded-lg shadow-xl p-4 flex items-start gap-3`}>
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="flex-shrink-0 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

function ClientDashboard() {
  const { currentUser } = useAuth()
  const [products, setProducts] = useState([])
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [submittingQuote, setSubmittingQuote] = useState(false)
  const [quoteName, setQuoteName] = useState('')
  
  // Toast state
  const [toast, setToast] = useState(null)

  const token = localStorage.getItem('token')

  // Toast helper function
  const showToast = (message, type = 'info') => {
    setToast({ message, type })
  }

  // Fetch real products & quotes
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const headers = { Authorization: `Bearer ${token}` }

        const [productsRes, quotesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`, { headers }),
          axios.get(`${API_BASE_URL}/quotes/client/my-quotes`, { headers })
        ])

        setProducts(productsRes.data.data || [])
        setQuotes(quotesRes.data.data || [])
      } catch (err) {
        console.error('Failed to load data', err)
        if (err.response?.status === 401) {
          showToast('Session expired. Please log in again.', 'error')
        } else {
          showToast('Failed to load data. Please refresh the page.', 'error')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: 'all', name: 'All Products' },
    ...Array.from(new Set(products.map(p => p.category))).map(cat => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) }))
  ]

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id)
      if (existing) {
        return prev.map(i => 
          i.productId === product.id 
            ? { ...i, qty: i.qty + 1 } 
            : i
        )
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        image: product.image || null,
        icon: product.icon
      }]
    })
    showToast(`${product.name} added to quote cart`, 'success')
  }

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.productId !== productId))
      showToast('Item removed from cart', 'info')
    } else {
      setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty } : i))
    }
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  const submitQuote = async () => {
  // Validation with toast messages
  if (cart.length === 0) {
    showToast('Your cart is empty. Add items before submitting.', 'warning')
    return
  }
  
  if (!quoteName.trim()) {
    showToast('Please name your quote before submitting.', 'warning')
    return
  }

  setSubmittingQuote(true)
  
  try {
    const headers = { Authorization: `Bearer ${token}` }

    // STEP 1: Create empty quote
    console.log('Step 1: Creating empty quote...')
    const createQuoteRes = await axios.post(
      `${API_BASE_URL}/quotes`,
      { notes: quoteName },
      { headers }
    )

    const newQuote = createQuoteRes.data.data.quote
    const quoteId = newQuote.id
    console.log('✓ Quote created with ID:', quoteId)

    // STEP 2: Add items
    console.log('Step 2: Adding items to quote...')
    const items = cart.map(item => ({
      productId: item.productId,
      quantity: item.qty
    }))

    await axios.post(
      `${API_BASE_URL}/quotes/${quoteId}/add-items`,
      { items },
      { headers }
    )
    console.log('✓ Items added to quote')

    // STEP 3: FINALIZE THE QUOTE (MISSING STEP!)
    console.log('Step 3: Finalizing quote...')
    const finalizeRes = await axios.put(
      `${API_BASE_URL}/quotes/${quoteId}/finalize`,
      {},
      { headers }
    )

    const finalizedQuote = finalizeRes.data.data.quote
    console.log('✓ Quote finalized and sent to manager:', finalizedQuote)

    // Update UI
    setQuotes(prev => [finalizedQuote, ...prev])
    setCart([])
    setQuoteName('')
    setShowCart(false)
    
    showToast('Quote submitted successfully! A manager will review and price your items.', 'success')

  } catch (err) {
    console.error('❌ Quote submission error:', err)
    console.error('Error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    })
    
    const errorMessage = err.response?.data?.message || err.message || 'Failed to submit quote'
    showToast(`Error: ${errorMessage}`, 'error')
  } finally {
    setSubmittingQuote(false)
  }
}

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-3xl font-black text-blue-900">NDAJE IS LOADING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo className="h-10" />
            <div>
              <h1 className="text-xl font-bold text-blue-900">NDAJE</h1>
              <p className="text-xs text-gray-600">Hotel Supply Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border rounded-2xl focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <button
              onClick={() => setShowCart(true)}
              className="relative p-3 rounded-xl bg-blue-900 text-white hover:bg-blue-800 transition"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-900">Welcome, {currentUser?.name || 'Client'}</h2>
            <p className="text-gray-600">Browse products and request quotes</p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <div className="mb-6 text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                  />
                ) : (
                  <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-48 mb-4 flex items-center justify-center text-6xl">
                    {product.icon}
                  </div>
                )}

                <h3 className="font-bold text-lg text-blue-900">{product.name}</h3>
                {product.reference && (
                  <p className="text-sm text-gray-500">Ref: {product.reference}</p>
                )}
                <p className="text-sm text-gray-600 mt-1">{product.category}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-900">
                      RWF {Number(product.price).toLocaleString()}
                    </p>
                    {product.sku && (
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 font-medium flex items-center gap-2 transition"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quotes History */}
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-6">My Quotes & Orders</h2>
          {quotes.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No quotes yet. Add items and submit your first quote!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {quotes.map(quote => (
                <div key={quote.id} className="bg-white rounded-2xl shadow p-6 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{quote.sourcingNotes || 'Untitled Quote'}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(quote.createdAt).toLocaleDateString()} • {quote.items?.length || 0} items
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      quote.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      quote.status === 'PENDING_PRICING' ? 'bg-yellow-100 text-yellow-800' :
                      quote.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {quote.status?.replace(/_/g, ' ') || 'pending'}
                    </span>
                  </div>
                  {quote.totalAmount > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-2xl font-bold text-blue-900">
                        Total: RWF {quote.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCart(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Quote Cart</h2>
              <button onClick={() => setShowCart(false)} className="hover:bg-gray-100 p-2 rounded-lg transition">
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>

            <div className="p-6 h-[calc(100vh-88px)] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-2">Add products to request a quote</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">RWF {item.price.toLocaleString()} × {item.qty}</p>
                          <p className="text-sm font-semibold text-blue-900 mt-1">
                            Subtotal: RWF {(item.price * item.qty).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={e => updateCartQty(item.productId, Number(e.target.value))}
                            className="w-20 px-3 py-2 border rounded-lg text-center font-medium"
                          />
                          <button 
                            onClick={() => updateCartQty(item.productId, 0)}
                            className="p-2 hover:bg-red-50 rounded-lg transition"
                          >
                            <TrashIcon className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-6 space-y-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Estimated Total</span>
                      <span className="text-blue-900">RWF {cartTotal.toLocaleString()}</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Name your quote (e.g. Monthly Restock March)"
                      value={quoteName}
                      onChange={e => setQuoteName(e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />

                    <button
                      onClick={submitQuote}
                      disabled={submittingQuote || cart.length === 0}
                      className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {submittingQuote ? (
  <span className="flex items-center justify-center gap-2">
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    Submitting...
  </span>
) : 'Submit Quote to Manager'}
                    </button>
                    
                    <p className="text-sm text-gray-500 text-center">
                      A manager will review and provide pricing for your quote
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ClientDashboard