import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock Firebase auth
jest.mock('../firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn((callback) => {
      callback(null); // Simulasi user belum login
      return jest.fn(); // Return unsubscribe function
    }),
  },
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Minimal test untuk memastikan komponen bisa di-render
    expect(document.body).toBeTruthy();
  });
}); 