import React, { createContext, useState, useContext, useEffect } from 'react'
import { loginApi, signupApi } from '../api/client'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
    // token may be present without user if app was closed mid-flow
    if (token && !storedUser) {
      // we could fetch /me here; keep simple for now
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    setCurrentUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    if (token) localStorage.setItem('token', token)
  }

  const signup = (userData, token) => {
    // mirror login behavior after signup
    login(userData, token)
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // async helpers that call API
  const signInWithCredentials = async (email, password) => {
    const data = await loginApi(email, password)
    // expected { user, token }
    login(data.user || data, data.token)
    return data
  }

  const signUpWithCredentials = async (payload) => {
    const data = await signupApi(payload)
    signup(data.user || data, data.token)
    return data
  }

  const value = {
    currentUser,
    login: (u) => login(u),
    logout,
    signup: (u, t) => signup(u, t),
    signInWithCredentials,
    signUpWithCredentials,
    isAuthenticated: !!currentUser
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}