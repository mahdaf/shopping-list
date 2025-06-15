import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../login";
import Register from "../register";
import { auth } from "../../firebase";
import "./index.css";
import { act } from "react-dom/test-utils";
import { render } from '@testing-library/react';
import App from '../App';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  if (user === undefined) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const Root = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
        <Route path="/beranda" element={<ProtectedRoute><App /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Hanya render ke DOM jika tidak dalam environment test
if (process.env.NODE_ENV !== 'test') {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  );
}

// Test suite
if (process.env.NODE_ENV === 'test') {
  describe('Root Component', () => {
    it('renders without crashing', async () => {
      const root = document.createElement('div');
      root.id = 'root';
      document.body.appendChild(root);
      
      await act(async () => {
        ReactDOM.createRoot(root).render(
          <React.StrictMode>
            <Root />
          </React.StrictMode>
        );
      });
      
      document.body.removeChild(root);
    });
  });

  describe('Main Entry Point', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
      expect(container).toBeTruthy();
    });
  });
}

export { Root, ProtectedRoute };