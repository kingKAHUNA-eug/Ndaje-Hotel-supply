import React, { useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../common/Logo'
import { addOrder, getOrders } from '../../utils/demoStore'

function ClientDashboard() {
  const { currentUser } = useAuth()

  const [product, setProduct] = useState('Towels (pack of 50)')
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState('')
  const orders = useMemo(() => getOrders().filter(o => o.clientId === currentUser?.id), [currentUser])

  const placeOrder = () => {
    if (!address) return alert('Please enter delivery address')
    addOrder({
      clientId: currentUser?.id,
      clientName: currentUser?.name,
      product,
      quantity,
      address,
      status: 'pending',
      paymentStatus: 'unpaid',
    })
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
      {/* Top navigation mimicking provided image */}
      <nav className="sticky top-0 z-10 bg-white text-gray-900 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          {/* Search bar centered like the reference */}
          <div className="flex-1">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <span className="text-gray-400">🔍</span>
                <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Search HotelSupply" />
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm ml-auto">
            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200">
              <span className="text-gray-600">📍</span>
              <span className="font-medium">Your Address</span>
              <span className="text-gray-500">▾</span>
            </button>
            <button className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200">Delivery</button>
            <button className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200">Pickup</button>
          </div>
          <div className="flex items-center gap-2">
            <a href="#login" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-gray-800 hover:bg-gray-100 border border-gray-200">👤 Sign In</a>
            <a href="#signup" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 shadow">Sign Up</a>
          </div>
        </div>
        {/* Sub-navigation moved here */}
        <div className="border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
            <ul className="flex items-center gap-6 py-2 text-sm text-gray-700">
              <li><a className="hover:text-primary-600" href="#">Home</a></li>
              <li><a className="hover:text-primary-600" href="#">Grocery</a></li>
              <li><a className="hover:text-primary-600" href="#">Retail</a></li>
              <li><a className="hover:text-primary-600" href="#">Convenience</a></li>
              <li><a className="hover:text-primary-600" href="#">Browse All</a></li>
            </ul>
          </div>
        </div>
      </nav>
      <main>
        {/* Top hero banner without sidebar */}
        <section className="relative bg-orange-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Everything you crave, delivered.</h2>
              <p className="text-gray-600 mb-6">Get all your hotel supplies in one place, delivered fast.</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-full flex items-center gap-3 pr-2 pl-4 py-2 text-left shadow">
                <span className="text-gray-500">📍</span>
                <input
                  value={address}
                  onChange={(e)=>setAddress(e.target.value)}
                  placeholder="Enter delivery address"
                  className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 py-2"
                />
                <button onClick={placeOrder} className="bg-primary-600 text-white rounded-full px-4 h-10 grid place-items-center hover:bg-primary-700 shadow">Go</button>
              </div>
            </div>
          </div>

          {/* no floating images on dashboard per requirement */}
        </section>

        {/* Category bubbles like the provided design */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 place-items-center">
              {[
                { icon: '🧴', label: 'Toiletries' },
                { icon: '🧻', label: 'Paper' },
                { icon: '🧺', label: 'Laundry' },
                { icon: '🥤', label: 'Beverages' },
                { icon: '🍽️', label: 'Tableware' },
                { icon: '🧹', label: 'Cleaning' },
              ].map((c) => (
                <div key={c.label} className="text-center">
                  <div className="w-28 h-28 rounded-full bg-orange-50 grid place-items-center text-4xl shadow">
                    <span>{c.icon}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 font-medium">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Decorative images moved to dashboard for visibility */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Place an order</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Product</label>
                  <select value={product} onChange={(e)=>setProduct(e.target.value)} className="input-field">
                    <option>Towels (pack of 50)</option>
                    <option>Bed Sheets (pack of 20)</option>
                    <option>Shampoo Bottles (box of 100)</option>
                    <option>Toilet Paper Rolls (box of 60)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                  <input type="number" min={1} value={quantity} onChange={(e)=>setQuantity(Number(e.target.value))} className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Delivery address</label>
                  <input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="e.g., Downtown, Kigali" className="input-field" />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={placeOrder} className="btn-primary">Submit order</button>
                <button className="btn-secondary">Save draft</button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent orders</h3>
              <div className="space-y-3">
                {orders.length === 0 && <p className="text-gray-500 text-sm">No orders yet</p>}
                {orders.map(o => (
                  <div key={o.id} className="border rounded-md p-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{o.product}</span>
                      <span className="text-gray-500">x{o.quantity}</span>
                    </div>
                    <div className="text-xs text-gray-500">{o.address}</div>
                    <div className="mt-1 text-xs"><span className="text-gray-600">Order:</span> {o.status} • <span className="text-gray-600">Payment:</span> {o.paymentStatus}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ClientDashboard