import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserData, setUserData, setLoginStatus } from '../src/utils/LocalStorage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(getUserData());

  const handleLogin = (userData) => {
    setLoginStatus(true);         
    setUserData(userData);        
    setUser(userData);           
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;