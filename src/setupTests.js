import '@testing-library/jest-dom';

// Mock TextEncoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock Firebase
jest.mock('../firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
  },
  db: {
    collection: jest.fn(),
  },
})); 