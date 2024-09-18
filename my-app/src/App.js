import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Component from './Component';
import { AuthProvider, useAuth } from './AuthContext'; // Ensure useAuth is imported here

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/main" element={<ProtectedRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

const ProtectedRoute = () => {
  const { user } = useAuth(); // Ensure useAuth is used here

  return user ? <Component /> : <Navigate to="/login" />;
};

export default App;
