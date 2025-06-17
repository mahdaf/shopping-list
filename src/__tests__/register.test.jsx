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

// Mock auth object
jest.mock("../../firebase", () => ({
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
    expect(screen.getByRole("heading", { name: "Register" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
  });

  it("user bisa input email dan password", () => {
    render(<Register />, { wrapper: MemoryRouter });
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.input(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.input(passwordInput, { target: { value: "123456" } });
    expect(emailInput.value).toBe("test@gmail.com");
    expect(passwordInput.value).toBe("123456");
  });

  it("register sukses: tampil alert dan navigate ke /login", async () => {
    mockCreateUser.mockResolvedValueOnce({});
    render(<Register />, { wrapper: MemoryRouter });

    fireEvent.input(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(expect.anything(), "test@gmail.com", "123456");
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Akun berhasil dibuat"));
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("register gagal: tampil error", async () => {
    mockCreateUser.mockRejectedValueOnce(new Error("(auth/email-already-in-use)"));
    render(<Register />, { wrapper: MemoryRouter });

    fireEvent.input(screen.getByPlaceholderText("Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.input(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("(auth/email-already-in-use)")).toBeInTheDocument();
      expect(window.alert).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

});
