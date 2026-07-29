import React, { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Send, ArrowLeft, Loader2, User, Phone, ShieldCheck, Tag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { toast } from 'react-hot-toast'

const Chat = () => {
  const { otherUserId } = useParams()
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const { user } = useAuth()
  const { stompClient } = useNotifications()
  
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [otherUser, setOtherUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (user && otherUserId) {
      fetchOtherUserData()
      fetchConversationData()
    }
  }, [otherUserId, user])

  useEffect(() => {
    if (stompClient && stompClient.connected && user) {
      const handleMessageReceived = (message) => {
        try {
          const receivedMsg = JSON.parse(message.body)
          const isRelevant = 
            (receivedMsg.sender.id === Number(otherUserId) && receivedMsg.receiver.id === user.id) ||
            (receivedMsg.sender.id === user.id && receivedMsg.receiver.id === Number(otherUserId))
          
          if (isRelevant) {
            setMessages(prev => {
              if (prev.some(m => m.id === receivedMsg.id)) return prev
              return [...prev, receivedMsg]
            })
          }
        } catch (e) {
          console.error("Error processing websocket chat message:", e)
        }
      }

      const sub1 = stompClient.subscribe('/user/queue/messages', handleMessageReceived)
      const sub2 = stompClient.subscribe(`/topic/messages/${user.id}`, handleMessageReceived)

      return () => {
        sub1.unsubscribe()
        sub2.unsubscribe()
      }
    }
  }, [otherUserId, stompClient, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchOtherUserData = async () => {
    try {
      const res = await axios.get(`/api/chat/user/${otherUserId}`)
      setOtherUser(res.data)
    } catch (err) {
      console.error('Error fetching target user data:', err)
    }
  }

  const fetchConversationData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/chat/conversation?userId=${user.id}&otherUserId=${otherUserId}`)
      setMessages(res.data)
      
      // Fallback: If otherUser wasn't fetched yet, infer from conversation
      if (!otherUser && res.data.length > 0) {
        const first = res.data[0]
        setOtherUser(first.sender.id === user.id ? first.receiver : first.sender)
      }
    } catch (err) {
      console.error('Error fetching conversation history:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const messageContent = newMessage
    setNewMessage('')

    try {
      const url = `/api/chat/send?senderId=${user.id}&receiverId=${otherUserId}${bookingId ? '&bookingId=' + bookingId : ''}`
      const res = await axios.post(url, messageContent, {
        headers: { 'Content-Type': 'text/plain' }
      })
      
      setMessages(prev => {
        if (prev.some(m => m.id === res.data.id)) return prev
        return [...prev, res.data]
      })
    } catch (err) {
      console.error('Error sending message:', err)
      toast.error('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link 
            to={user?.role === 'VENDOR' ? '/vendor/dashboard' : '/user/dashboard'} 
            className="p-2 hover:bg-white rounded-full transition-all text-slate-600 hover:text-slate-900 shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary-200">
              {otherUser ? otherUser.name[0].toUpperCase() : <User size={22} />}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base leading-tight">
                {otherUser?.name || 'Service Partner'}
              </h2>
              {otherUser?.role && (
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full">
                  {otherUser.role}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck size={12} /> Direct Bargaining & Service Chat
            </p>
          </div>
        </div>

        {bookingId && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
            <Tag size={14} className="text-primary-600" />
            <span>Booking #{bookingId}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50/30 to-white">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <Loader2 className="animate-spin text-primary-600" size={28} />
            <p className="text-xs font-medium">Loading chat history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-24 px-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-600 mb-3">
              <Send size={28} />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Start the Conversation</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Chat directly with {otherUser?.name || 'your partner'} to discuss job requirements, timings, or bargain prices.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender.id === user.id
            return (
              <div 
                key={msg.id || idx} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isMe 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-150 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-semibold">
                  {msg.sentAt 
                    ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Just now'}
                </span>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white flex gap-3 items-center">
        <input 
          type="text" 
          placeholder={`Message ${otherUser?.name || ''}...`}
          className="flex-1 px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          className="p-3.5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-lg shadow-primary-200"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}

export default Chat
