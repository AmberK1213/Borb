import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import './index.css'
import NewTopic from './pages/newTopic'
import BrowseTopics from './pages/BrowseTopics'
import TopicFullView from './pages/TopicFulllView'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/newTopic" element={<NewTopic />} />
        <Route path="/browse" element={<BrowseTopics />} />
        <Route path="/topic/:id" element={<TopicFullView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
