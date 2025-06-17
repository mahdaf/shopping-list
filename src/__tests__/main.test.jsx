jest.mock("../../firebase", () => ({
  auth: {
    onAuthStateChanged: jest.fn((callback) => {
      callback({ uid: "KPbulMZyMDbUhE17nXgIVlLhAd13", email: "test@gmail.com" });
      return jest.fn(); // unsubscribe
    }),
  },
}));

import React from "react";
import { render, screen, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Root, ProtectedRoute } from "../main";
import { auth } from "../../firebase";

// Mock login & register
jest.mock("../login", () => () => <div>Login</div>);
jest.mock("../register", () => () => <div>Register</div>);

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("Root Component", () => {
  it("renders into root element without crashing", async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    await act(async () => {
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <Root />
        </React.StrictMode>
      );
    });

    expect(document.body.contains(root)).toBe(true);
    document.body.removeChild(root);
  });
});

describe("ProtectedRoute - renders when user exists", () => {
  it("renders children", () => {
    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});

describe("ProtectedRoute - loading state", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    auth.onAuthStateChanged = jest.fn((callback) => {
      callback(undefined); // simulate loading
      return jest.fn();
    });
  });

  it("shows loading when user is undefined", () => {
    renderWithRouter(
      <ProtectedRoute>
        <div>Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe("ProtectedRoute - redirect when user null (belum login)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    auth.onAuthStateChanged = jest.fn((callback) => {
      callback(null); // Simulasi user belum login
      return jest.fn();
    });
  });

  it("redirects to /login when user null", () => {
    renderWithRouter(
      <ProtectedRoute>
        <div>Daftar Belanja</div>
      </ProtectedRoute>
    );
    expect(screen.queryByText("Daftar Belanja")).not.toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });
});
