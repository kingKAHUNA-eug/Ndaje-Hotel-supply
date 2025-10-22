import React, { createContext, useState, useContext } from 'react'

const LocationContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export function useLocation() {
  return useContext(LocationContext)
}

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')

  const updateLocation = (location) => {
    setUserLocation(location)
  }

  const updateDeliveryAddress = (address) => {
    setDeliveryAddress(address)
  }

  const value = {
    userLocation,
    deliveryAddress,
    updateLocation,
    updateDeliveryAddress
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}