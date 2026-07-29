import React, { createContext, useContext, useState, useEffect } from 'react'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { useAuth } from './AuthContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [stompClient, setStompClient] = useState(null)

  // Loud Synthesizer Beep for Vendor
  const playLoudVendorBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      
      const playBeep = (freq, duration, delay) => {
        setTimeout(() => {
          if (audioCtx.state === 'suspended') {
            audioCtx.resume()
          }
          const osc = audioCtx.createOscillator()
          const gain = audioCtx.createGain()
          
          osc.type = 'sawtooth' // High visibility sharp alarm sound
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
          
          // Loud volume ramp
          gain.gain.setValueAtTime(0.8, audioCtx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration)
          
          osc.connect(gain)
          gain.connect(audioCtx.destination)
          
          osc.start()
          osc.stop(audioCtx.currentTime + duration)
        }, delay)
      }

      // Loud 3-burst alarm sequence (BEEP! BEEP! BEEP!)
      playBeep(880, 0.25, 0)
      playBeep(1200, 0.25, 300)
      playBeep(880, 0.3, 600)
      playBeep(1400, 0.35, 950)
    } catch (e) {
      console.error('AudioContext synth error:', e)
    }

    // Audio file fallback
    new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(e => {})
  }

  useEffect(() => {
    if (user && token) {
      fetchNotifications()

      const wsUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/ws` 
        : 'http://localhost:8080/ws'
      const socket = new SockJS(wsUrl)
      const client = Stomp.over(socket)
      
      // Disable debug logs to keep console clean
      client.debug = null

      const headers = { Authorization: `Bearer ${token}` }

      client.connect(headers, () => {
        setStompClient(client)
        
        const handleNotification = (message) => {
          const newNotification = JSON.parse(message.body)
          setNotifications(prev => {
            if (prev.some(n => n.id === newNotification.id)) return prev
            return [newNotification, ...prev]
          })
          
          // Play loud sound for Vendor
          if (user.role === 'VENDOR') {
            playLoudVendorBeep()
          } else {
            new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(e => {})
          }

          toast.success(`${newNotification.title}: ${newNotification.message}`, {
            duration: 8000,
            position: 'top-right',
            style: {
              borderRadius: '24px',
              background: '#0f172a',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 'bold',
              border: '2px solid #6366f1'
            }
          })
          
          if (Notification.permission === "granted") {
            new Notification(newNotification.title, { body: newNotification.message })
          }
        }

        client.subscribe(`/user/topic/notifications`, handleNotification)
        client.subscribe(`/user/queue/notifications`, handleNotification)
        client.subscribe(`/topic/notifications/${user.id}`, handleNotification)
      }, (error) => {
        console.error('WebSocket connection error:', error)
      })

      return () => {
        if (client.connected) client.disconnect()
      }
    }
  }, [user, token])

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/api/notifications/${user.id}`)
      setNotifications(res.data)
    } catch (err) {
      console.error('Error fetching notifications:', err)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/read/${id}`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, stompClient }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
