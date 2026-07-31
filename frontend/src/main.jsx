import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = API_URL;

// ⭐⭐⭐ ADD THIS ⭐⭐⭐
const token = localStorage.getItem("token");

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)