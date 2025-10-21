import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getOrders } from '../../utils/demoStore'

function AdminDashboard() {
  const { currentUser } = useAuth()
  const [orders, setOrders] = useState([])
  useEffect(()=>{ setOrders(getOrders()) }, [])

  const totalIncome = useMemo(() => {
    // Demo: assume fixed price mapping
    const priceOf = (product) => {
      if (product.includes('Towels')) return 150
      if (product.includes('Bed Sheets')) return 300
      if (product.includes('Shampoo')) return 120
      if (product.includes('Toilet')) return 80
      return 100
    }
    return orders
      .filter(o => o.paymentStatus === 'received')
      .reduce((sum, o) => sum + priceOf(o.product) * o.quantity, 0)
  }, [orders])

  const topProducts = useMemo(() => {
    const counts = {}
    orders.forEach(o => { counts[o.product] = (counts[o.product] || 0) + o.quantity })
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5)
  }, [orders])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {currentUser?.name || 'Admin'}</p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-sm text-gray-500">Total Income</div>
              <div className="text-3xl font-bold">RWF {totalIncome.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-sm text-gray-500">Total Orders</div>
              <div className="text-3xl font-bold">{orders.length}</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-sm text-gray-500">Paid Orders</div>
              <div className="text-3xl font-bold">{orders.filter(o=>o.paymentStatus==='received').length}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Top supplied products</h3>
              <ul className="space-y-2">
                {topProducts.map(([name,count]) => (
                  <li key={name} className="flex justify-between border-b py-2">
                    <span>{name}</span>
                    <span className="text-gray-600">{count}</span>
                  </li>
                ))}
                {topProducts.length === 0 && <li className="text-gray-500">No data yet</li>}
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent activity</h3>
              <div className="space-y-2 text-sm">
                {orders.slice(0,8).map(o => (
                  <div key={o.id} className="flex justify-between">
                    <span>{o.clientName} ordered {o.product}</span>
                    <span className="text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
                {orders.length === 0 && <div className="text-gray-500">No activity yet</div>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard


