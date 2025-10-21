const STORAGE_KEY = 'hs_demo_orders'

export function getOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function addOrder(order) {
  const orders = getOrders()
  const withId = { id: Date.now(), createdAt: new Date().toISOString(), ...order }
  orders.unshift(withId)
  saveOrders(orders)
  return withId
}

export function updateOrder(id, updater) {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === id)
  if (idx === -1) return null
  orders[idx] = { ...orders[idx], ...updater }
  saveOrders(orders)
  return orders[idx]
}


