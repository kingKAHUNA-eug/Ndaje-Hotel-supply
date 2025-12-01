import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../common/Logo'
import API_BASE_URL from '../../config/api'
import axios from 'axios'

import {
  MagnifyingGlassIcon,
  MapPinIcon,
  PlusIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  EyeIcon,
  TrashIcon,
  BanknotesIcon,
  CreditCardIcon,
  SparklesIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'

function ClientDashboard() {
  const { currentUser } = useAuth()
  const [products, setProducts] = useState([])
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState([]) // Real cart in memory (per session)
  const [showCart, setShowCart] = useState(false)
  const [submittingQuote, setSubmittingQuote] = useState(false)
  const [quoteName, setQuoteName] = useState('')

  const token = localStorage.getItem('token') // ✅ FIXED - Only use 'token'

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
          alert('Session expired. Please log in again.')
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
      price: product.price,           // ← Use real price
      qty: 1,
      image: product.image || null,
      icon: product.icon
    }]
  })
}

  const updateCartQty = (productId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.productId !== productId))
    } else {
      setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty } : i))
    }
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  const submitQuote = async () => {
    if (cart.length === 0) return alert('Cart is empty')
    if (!quoteName.trim()) return alert('Please name your quote')

    setSubmittingQuote(true)
    try {
      const payload = {
        name: quoteName,
        items: cart.map(i => ({ productId: i.productId, quantity: i.qty }))
      }

      const res = await axios.post(`${API_BASE_URL}/quotes`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setQuotes(prev => [...prev, res.data.data])
      setCart([])
      setQuoteName('')
      setShowCart(false)
      alert('Quote submitted successfully! Manager will review and price it.')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quote')
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
              className="relative p-3 rounded-xl bg-blue-900 text-white hover:bg-blue-800"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <div className="mb-6 text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
          </div>
          {filteredProducts.map(product => (
  <div key={product.id} className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6">
    {/* REAL IMAGE */}
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
        className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 font-medium flex items-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        Add to Quote
      </button>
    </div>
  </div>
))}
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
                <div key={quote._id} className="bg-white rounded-2xl shadow p-6 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{quote.name || 'Untitled Quote'}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(quote.createdAt).toLocaleDateString()} • {quote.items.length} items
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                      quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {quote.status || 'pending'}
                    </span>
                  </div>
                  {quote.finalPrice && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-2xl font-bold text-blue-900">
                        Final Price: RWF {quote.finalPrice.toLocaleString()}
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
              <button onClick={() => setShowCart(false)}>
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>

            <div className="p-6 h-full overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-12">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.productId} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">RWF {item.price.toLocaleString()} × {item.qty}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={e => updateCartQty(item.productId, Number(e.target.value))}
                            className="w-20 px-3 py-2 border rounded-lg text-center"
                          />
                          <button onClick={() => updateCartQty(item.productId, 0)}>
                            <TrashIcon className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t mt-6 pt-6">
                    <div className="flex justify-between text-xl font-bold mb-6">
                      <span>Estimated Total</span>
                      <span>RWF {cartTotal.toLocaleString()}</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Name your quote (e.g. Monthly Restock March)"
                      value={quoteName}
                      onChange={e => setQuoteName(e.target.value)}
                      className="w-full px-4 py-3 border rounded-xl mb-4"
                    />

                    <button
                      onClick={submitQuote}
                      disabled={submittingQuote || cart.length === 0 || !quoteName.trim()}
                      className="w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-lg hover:bg-blue-800 disabled:opacity-50"
                    >
                      {submittingQuote ? 'Submitting...' : 'Submit Quote Request'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientDashboard