import React, { useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getOrders } from '../../utils/demoStore'

function SupplierDashboard() {
  const { currentUser } = useAuth()

  const orders = useMemo(() => getOrders().filter(o => o.status !== 'fulfilled'), [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
          <p className="text-gray-600">Welcome, {currentUser?.name}</p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Open orders to fulfill</h3>
            <div className="space-y-3">
              {orders.length === 0 && <p className="text-gray-500 text-sm">No open orders</p>}
              {orders.map(o => (
                <div key={o.id} className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{o.product} <span className="text-gray-500">x{o.quantity}</span></div>
                      <div className="text-xs text-gray-500">Deliver to: {o.address}</div>
                    </div>
                    <div className="text-sm">Payment: {o.paymentStatus}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SupplierDashboard