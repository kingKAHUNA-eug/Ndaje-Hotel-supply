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
  InformationCircleIcon,
  CreditCardIcon,
  ArrowPathIcon,
  BanknotesIcon
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

// Payment Modal Component
function PaymentModal({ isOpen, onClose, quote, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const token = localStorage.getItem('token')

  const handlePayment = async () => {
    if (!quote) return
    
    setProcessing(true)
    try {
      // Simulate payment processing with backend
      const response = await axios.post(
        `${API_BASE_URL}/quotes/${quote.id}/process-payment`,
        {
          amount: quote.totalAmount,
          paymentMethod,
          cardDetails: paymentMethod === 'card' ? {
            number: cardNumber,
            expiry,
            cvv,
            name
          } : null,
          quoteId: quote.id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.data.success) {
        setPaymentSuccess(true)
        setTimeout(() => {
          onPaymentSuccess(quote.id, response.data.data?.paymentId)
          onClose()
        }, 2000)
      }
    } catch (err) {
      console.error('Payment failed:', err)
      alert(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (!isOpen || !quote) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
              <p className="text-gray-600 mt-1">
                Quote #{quote.id?.slice(-8)} • RWF {quote.totalAmount?.toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {paymentSuccess ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h3>
              <p className="text-gray-600">Your order has been confirmed and is being processed.</p>
              <p className="text-sm text-gray-500 mt-4">Redirecting...</p>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {quote.items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.product?.name || 'Product'} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        RWF {(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-blue-900">
                        RWF {quote.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border-2 rounded-xl flex items-center justify-center gap-3 transition ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCardIcon className="w-6 h-6" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('mobile')}
                    className={`p-4 border-2 rounded-xl flex items-center justify-center gap-3 transition ${
                      paymentMethod === 'mobile'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <BanknotesIcon className="w-6 h-6" />
                    <span className="font-medium">Mobile Money</span>
                  </button>
                </div>
              </div>

              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Money Form */}
              {paymentMethod === 'mobile' && (
                <div className="mb-8">
                  <p className="text-sm text-gray-600 mb-4">
                    You will receive a payment request on your registered mobile number.
                    Please approve the request to complete your payment.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-blue-700">
                        Payment request will be sent to your registered phone number
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  disabled={processing}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processing || (paymentMethod === 'card' && (!cardNumber || !expiry || !cvv || !name))}
                  className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay RWF ${quote.totalAmount?.toLocaleString()}`
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Rejection Reason Modal
function RejectionModal({ isOpen, onClose, quote, onReject }) {
  const [reason, setReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const rejectionReasons = [
    'Price is too high',
    'Found better price elsewhere',
    'Items not needed anymore',
    'Budget constraints',
    'Need more time to decide',
    'Other reason'
  ]

  const handleReject = async () => {
    if (!reason) {
      alert('Please select a reason for rejection')
      return
    }

    setSubmitting(true)
    try {
      const finalReason = reason === 'Other reason' ? customReason : reason
      await onReject(finalReason)
      onClose()
    } catch (err) {
      console.error('Rejection failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reject Quote</h2>
              <p className="text-gray-600 mt-1">
                #{quote?.id?.slice(-8) || 'N/A'} • RWF {quote?.totalAmount?.toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Please select a reason:</h3>
              <div className="space-y-2">
                {rejectionReasons.map((r) => (
                  <label key={r} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="rejectionReason"
                      value={r}
                      checked={reason === r}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {reason === 'Other reason' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please specify:
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                  placeholder="Enter your reason here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={submitting || !reason || (reason === 'Other reason' && !customReason)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
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
  
  // New states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedQuoteForPayment, setSelectedQuoteForPayment] = useState(null)
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false)
  const [quoteToReject, setQuoteToReject] = useState(null)
  
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

  // NEW FUNCTION: Handle quote approval/rejection
  const handleQuoteAction = async (quoteId, action, reason = '') => {
    try {
      const headers = { Authorization: `Bearer ${token}` }
      
      let endpoint = ''
      let data = {}
      
      if (action === 'approve') {
        endpoint = `${API_BASE_URL}/quotes/${quoteId}/client-approve`
      } else if (action === 'reject') {
        endpoint = `${API_BASE_URL}/quotes/${quoteId}/client-reject`
        data = { reason }
      }
      
      const response = await axios.post(endpoint, data, { headers })
      
      if (response.data.success) {
        // Update local quotes state
        setQuotes(prev => prev.map(quote => 
          quote.id === quoteId 
            ? { ...quote, status: action === 'approve' ? 'APPROVED' : 'REJECTED' }
            : quote
        ))
        
        showToast(
          action === 'approve' 
            ? 'Quote approved successfully!' 
            : 'Quote rejected successfully.',
          'success'
        )
        
        // If approved, show payment button
        if (action === 'approve') {
          // Optional: automatically open payment modal
          // const approvedQuote = quotes.find(q => q.id === quoteId)
          // setSelectedQuoteForPayment(approvedQuote)
          // setPaymentModalOpen(true)
        }
      }
    } catch (err) {
      console.error('Quote action failed:', err)
      showToast(
        err.response?.data?.message || `Failed to ${action} quote`,
        'error'
      )
    }
  }

  // NEW FUNCTION: Handle payment initiation
  const handlePayment = (quoteId) => {
    const quote = quotes.find(q => q.id === quoteId)
    if (!quote) {
      showToast('Quote not found', 'error')
      return
    }
    
    setSelectedQuoteForPayment(quote)
    setPaymentModalOpen(true)
  }

  // NEW FUNCTION: Handle payment success
  const handlePaymentSuccess = async (quoteId, paymentId) => {
    try {
      // Update quote status to PAID
      const headers = { Authorization: `Bearer ${token}` }
      
      const response = await axios.post(
        `${API_BASE_URL}/quotes/${quoteId}/mark-as-paid`,
        { paymentId },
        { headers }
      )
      
      if (response.data.success) {
        setQuotes(prev => prev.map(quote => 
          quote.id === quoteId 
            ? { ...quote, status: 'PAID', paymentId }
            : quote
        ))
        
        showToast('Payment completed successfully! Your order is being processed.', 'success')
      }
    } catch (err) {
      console.error('Failed to update payment status:', err)
      // Still show success but log error
    }
  }

  // Helper function to initiate rejection
  const initiateRejection = (quote) => {
    setQuoteToReject(quote)
    setRejectionModalOpen(true)
  }

  // Helper function to confirm rejection with reason
  const confirmRejection = async (reason) => {
    if (!quoteToReject) return
    
    await handleQuoteAction(quoteToReject.id, 'reject', reason)
    setRejectionModalOpen(false)
    setQuoteToReject(null)
  }

  // Filter products
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

      // STEP 3: FINALIZE THE QUOTE
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

  // Helper function to get status badge
  const getStatusBadge = (quote) => {
    const statusConfig = {
      'PENDING_PRICING': { color: 'bg-yellow-100 text-yellow-800', text: 'Awaiting Pricing' },
      'IN_PRICING': { color: 'bg-blue-100 text-blue-800', text: 'Being Priced' },
      'AWAITING_CLIENT_APPROVAL': { color: 'bg-purple-100 text-purple-800', text: 'Awaiting Your Approval' },
      'APPROVED': { color: 'bg-green-100 text-green-800', text: 'Approved - Ready to Pay' },
      'PAID': { color: 'bg-emerald-100 text-emerald-800', text: 'Paid' },
      'REJECTED': { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      'CONVERTED_TO_ORDER': { color: 'bg-indigo-100 text-indigo-800', text: 'Order Created' }
    }
    
    const config = statusConfig[quote.status] || { color: 'bg-gray-100 text-gray-800', text: quote.status?.replace(/_/g, ' ') || 'Unknown' }
    
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    )
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        quote={selectedQuoteForPayment}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={rejectionModalOpen}
        onClose={() => {
          setRejectionModalOpen(false)
          setQuoteToReject(null)
        }}
        quote={quoteToReject}
        onReject={confirmRejection}
      />

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
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{quote.sourcingNotes || 'Untitled Quote'}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(quote.createdAt).toLocaleDateString()} • {quote.items?.length || 0} items
                      </p>
                    </div>
                    {getStatusBadge(quote)}
                  </div>

                  {/* Quote Items */}
                  {quote.items && quote.items.length > 0 && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">Items in this quote:</h4>
                      <div className="space-y-2">
                        {quote.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">
                              {item.product?.name || 'Product'} × {item.quantity}
                            </span>
                            {item.unitPrice > 0 && (
                              <span className="font-semibold text-gray-900">
                                RWF {(item.unitPrice * item.quantity).toLocaleString()}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Manager Notes */}
                  {quote.sourcingNotes && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Manager Notes: </span>
                        {quote.sourcingNotes}
                      </p>
                    </div>
                  )}
                  
                  {/* Total Amount */}
                  {quote.totalAmount > 0 && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold text-blue-900">
                          Total: RWF {quote.totalAmount.toLocaleString()}
                        </p>
                        
                        {/* Action Buttons */}
                        {quote.status === 'AWAITING_CLIENT_APPROVAL' && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => initiateRejection(quote)}
                              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
                            >
                              Reject Quote
                            </button>
                            <button
                              onClick={() => handleQuoteAction(quote.id, 'approve')}
                              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-medium"
                            >
                              Approve & Pay
                            </button>
                          </div>
                        )}
                        
                        {quote.status === 'APPROVED' && (
                          <button
                            onClick={() => handlePayment(quote.id)}
                            className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition font-medium flex items-center gap-2"
                          >
                            <CreditCardIcon className="w-5 h-5" />
                            Proceed to Payment
                          </button>
                        )}
                        
                        {quote.status === 'PAID' && (
                          <div className="text-sm text-green-600 font-medium">
                            ✓ Payment completed
                            {quote.paymentId && (
                              <p className="text-xs text-gray-500">Payment ID: {quote.paymentId}</p>
                            )}
                          </div>
                        )}
                        
                        {quote.status === 'REJECTED' && (
                          <div className="text-sm text-red-600 font-medium">
                            ❌ Quote rejected
                            {quote.rejectionReason && (
                              <p className="text-xs text-gray-500">Reason: {quote.rejectionReason}</p>
                            )}
                          </div>
                        )}
                      </div>
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