import React, { useMemo } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getOrders, updateOrder } from '../../utils/demoStore'

function ManagerDashboard() {
  const { currentUser } = useAuth()

  const orders = useMemo(() => getOrders(), [])

  const approvePayment = (id) => {
    updateOrder(id, { paymentStatus: 'received' })
    window.location.reload()
  }

  const markFulfilled = (id) => {
    updateOrder(id, { status: 'fulfilled' })
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600">Welcome, {currentUser?.name}</p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Incoming orders</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="p-2">Client</th>
                    <th className="p-2">Product</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Address</th>
                    <th className="p-2">Order</th>
                    <th className="p-2">Payment</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr><td className="p-3 text-gray-500" colSpan={7}>No orders yet</td></tr>
                  )}
                  {orders.map(o => (
                    <tr key={o.id} className="border-t">
                      <td className="p-2">{o.clientName}</td>
                      <td className="p-2">{o.product}</td>
                      <td className="p-2">{o.quantity}</td>
                      <td className="p-2">{o.address}</td>
                      <td className="p-2">{o.status}</td>
                      <td className="p-2">{o.paymentStatus}</td>
                      <td className="p-2 flex gap-2">
                        <button onClick={()=>approvePayment(o.id)} className="btn-success btn-sm">Approve</button>
                        <button onClick={()=>markFulfilled(o.id)} className="btn-warning btn-sm">Fulfilled</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ManagerDashboard 