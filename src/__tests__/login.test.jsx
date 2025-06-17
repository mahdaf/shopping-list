import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../login";
import { signInWithEmailAndPassword } from "firebase/auth";
import { BrowserRouter } from "react-router-dom";

// Mock Firebase Auth
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  beforeEach(() => {
    signInWithEmailAndPassword.mockReset();
    mockNavigate.mockReset();
  });

  const setup = () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it("renders input fields and login button", () => {
    setup();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates input values", () => {
    setup();
    fireEvent.input(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    expect(screen.getByPlaceholderText("Email").value).toBe("test@gmail.com");
    expect(screen.getByPlaceholderText("Password").value).toBe("123456");
  });

  it("navigates to /beranda on successful login", async () => {
    signInWithEmailAndPassword.mockResolvedValue({});
    setup();

    fireEvent.input(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/beranda");
    });
  });

  it("shows error message on failed login", async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error("Login failed"));
    setup();

    fireEvent.input(screen.getByPlaceholderText("Email"), {
      target: { value: "wrong@gmail.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/your input is incorrect/i)).toBeInTheDocument();
    });
  });

  it("renders register link", () => {
    setup();
    expect(screen.getByText(/Belum punya akun\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Daftar di sini/i).closest("a")).toHaveAttribute("href", "/register");
  });
});
