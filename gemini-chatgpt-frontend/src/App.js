// gemini-chatgpt-frontend/src/App.js


import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ChatBox from './components/ChatBox';
import Login from './components/Login';
import Signup from './components/Signup';
import './styles.css';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data (e.g., token) exists in localStorage
    const user = localStorage.getItem('user');
    if (user) {
      // Redirect to chat if user exists in localStorage
      navigate('/chat');
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />         {/* Login page */}
        <Route path="/signup" element={<Signup />} />  {/* Signup page */}
        <Route path="/chat" element={<ChatBox />} />   {/* ChatBox page */}
      </Routes>
    </div>
  );
}

// Wrap App with Router to allow navigation in the useEffect
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
