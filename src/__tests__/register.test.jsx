import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../register";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children, ...props }) => <a {...props}>{children}</a>
}));

// Mock createUserWithEmailAndPassword
const mockCreateUser = jest.fn();
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: (...args) => mockCreateUser(...args),
}));

// Mock auth object (bisa kosong, tidak dipakai dalam test ini)
jest.mock("../firebase", () => ({
  auth: {},
}));

// Mock window.alert
window.alert = jest.fn();

beforeEach(() => {
  mockCreateUser.mockReset();
  mockNavigate.mockReset();
  window.alert.mockReset();
});

describe("Register Component", () => {
  it("render komponen dan input tampil", () => {
    render(<Register />, { wrapper: MemoryRouter });
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText(/Login di sini/i)).toBeInTheDocument();
  });

  it("user bisa input email dan password", () => {
    render(<Register />, { wrapper: MemoryRouter });
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.input(emailInput, { target: { value: "user@mail.com" } });
    fireEvent.input(passwordInput, { target: { value: "rahasia123" } });
    expect(emailInput.value).toBe("user@mail.com");
    expect(passwordInput.value).toBe("rahasia123");
  });

  it("register sukses: tampil alert dan navigate ke /login", async () => {
    mockCreateUser.mockResolvedValueOnce({});
    render(<Register />, { wrapper: MemoryRouter });

    fireEvent.input(screen.getByPlaceholderText("Email"), {
      target: { value: "test@mail.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(expect.anything(), "test@mail.com", "password");
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Akun berhasil dibuat"));
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("register gagal: tampil error", async () => {
    mockCreateUser.mockRejectedValueOnce(new Error("Email sudah terdaftar!"));
    render(<Register />, { wrapper: MemoryRouter });

    fireEvent.input(screen.getByPlaceholderText("Email"), {
      target: { value: "test@mail.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("Email sudah terdaftar!")).toBeInTheDocument();
      expect(window.alert).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("link login mengarah ke /login", () => {
    render(<Register />, { wrapper: MemoryRouter });
    const link = screen.getByText(/Login di sini/i);
    expect(link).toHaveAttribute("href", "/login");
  });
});
