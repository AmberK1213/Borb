import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import './index.css'
import NewTopic from './pages/newTopic'
import BrowseTopics from './pages/BrowseTopics'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/newTopic" element={<NewTopic />} />
        <Route path="/browse" element={<BrowseTopics />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
