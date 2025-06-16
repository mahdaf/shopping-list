import React from "react";
import { render, screen, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "../App";
import { Root, ProtectedRoute } from "../main";

// ✅ Mock auth untuk default test user ada
jest.mock("../../firebase", () => ({
  auth: {
    onAuthStateChanged: jest.fn((callback) => {
      callback({ uid: "123", email: "user@example.com" });
      return jest.fn(); // unsubscribe
    }),
  },
}));

// ✅ Mock login & register
jest.mock("../login", () => () => <div>Login Page</div>);
jest.mock("../register", () => () => <div>Register Page</div>);

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
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});

describe("ProtectedRoute - loading state", () => {
  it("shows loading when user is undefined", async () => {
    jest.resetModules();
    jest.doMock("../../firebase", () => ({
      auth: {
        onAuthStateChanged: jest.fn((callback) => {
          callback(undefined); // simulate loading
          return jest.fn();
        }),
      },
    }));

    const { ProtectedRoute } = await import("../main");
    render(<ProtectedRoute><div>Content</div></ProtectedRoute>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
describe("ProtectedRoute - redirect saat user null (belum login)", () => {
  it("redirects to /login jika user null", async () => {
    // Reset module dan mock ulang
    jest.resetModules();
    jest.doMock("../../firebase", () => ({
      auth: {
        onAuthStateChanged: jest.fn((callback) => {
          callback(null); // Simulasi user belum login
          return jest.fn();
        }),
      },
    }));

    // Import ulang ProtectedRoute dari main (karena sudah dimock)
    const { ProtectedRoute } = await import("../main");

    // Render dengan BrowserRouter (karena Navigate butuh router context)
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Ini Konten Rahasia</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Cek: anaknya tidak tampil (karena user null)
    expect(screen.queryByText("Ini Konten Rahasia")).not.toBeInTheDocument();

    // Cek: harus terjadi redirect ke /login
    // Kamu bisa cek ada element tertentu (misal, Login Page jika mock login seperti di test kamu)
    // Jadi, karena login di-mock jadi <div>Login Page</div>
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
