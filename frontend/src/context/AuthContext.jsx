import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const initializeAuth = () => {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
      } else {
        setToken(null)
        setUser(null)
        delete axios.defaults.headers.common['Authorization']
      }
      setLoading(false)
    }

    initializeAuth()

    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'token' || e.key === 'user') {
        initializeAuth()
      }
    })

    return () => window.removeEventListener('storage', initializeAuth)
  }, [])

  const login = async (email, password) => {
    try {
      // Clear previous auth to avoid mixing
      logout() 
      
      const res = await axios.post('/api/auth/login', { email, password })
      const { token: newToken, ...userData } = res.data
      
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      if (userData.role === 'VENDOR') {
        navigate('/vendor/dashboard')
      } else {
        navigate('/')
      }
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      logout()
      const res = await axios.post('/api/auth/register', userData)
      const { token: newToken, ...data } = res.data
      setToken(newToken)
      setUser(data)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(data))
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      if (data.role === 'VENDOR') {
        navigate('/vendor/dashboard')
      } else {
        navigate('/')
      }
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.error || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    // Only navigate if we're not already on a public page
    if (location.pathname.includes('dashboard') || location.pathname.includes('tracking')) {
      navigate('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
