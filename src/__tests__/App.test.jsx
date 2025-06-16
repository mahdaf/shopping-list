
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import { BrowserRouter } from "react-router-dom";

// Mock Firebase
jest.mock("../../firebase", () => ({
  auth: {
    currentUser: {
      uid: "KPbulMZyMDbUhE17nXgIVlLhAd13",
      email: "test@gmail.com",
    },
    signOut: jest.fn(() => Promise.resolve()),
  },
}));

// Global storage for test state
let appState = {
  loading: false,
  error: null,
};

// Dynamic mock useFirestoreCollection
jest.mock("../hooks/useFirestoreCollection", () => {
  const addItem = jest.fn();
  const updateItem = jest.fn();
  const deleteItem = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      items: [
        { id: "1", nama: "Sabun", harga: 3000, jumlah: 2, isPurchased: false },
      ],
      loading: appState.loading,
      error: appState.error,
      addItem,
      updateItem,
      deleteItem,
    }),
  };
});

// Mock CustomForm
jest.mock("../components/CustomForm", () => ({ addItem }) => {
  return <button onClick={() => addItem({ nama: "Sabun", harga: 3000, jumlah: 2 })}>Add Item</button>;
});

// Mock EditForm
jest.mock("../components/EditForm", () => ({ editedTask, updateTask, closeEditMode }) => (
  <div>
    <p>Edit Mode: {editedTask?.nama}</p>
    <button onClick={() => updateTask({ ...editedTask, nama: "Updated" })}>Save</button>
    <button onClick={closeEditMode}>Close</button>
  </div>
));

// Mock TaskList
jest.mock("../components/TaskList", () => ({ items, deleteItem, enterEditMode, togglePurchased }) => (
  <div>
    {items.map((item) => (
      <div key={item.id}>
        <p>{item.nama}</p>
        <button onClick={() => deleteItem(item.id)}>Delete</button>
        <button onClick={() => enterEditMode(item)}>Edit</button>
        <button onClick={() => togglePurchased(item.id)}>Toggle</button>
      </div>
    ))}
  </div>
));

// Mock ThemeSwitcher
jest.mock("../components/ThemeSwitcher", () => () => <div>Theme Switch</div>);

describe("App Component", () => {
  const renderApp = () =>
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    appState.loading = false;
    appState.error = null;
  });

  it("renders content", () => {
    renderApp();
    expect(screen.getByText(/Daftar Belanja/i)).toBeInTheDocument();
    expect(screen.getByText("Sabun")).toBeInTheDocument();
  });

  it("handles addItem", () => {
    renderApp();
    fireEvent.click(screen.getByText("Add Item"));
  });

  it("handles deleteItem", () => {
    renderApp();
    fireEvent.click(screen.getByText("Delete"));
  });

  it("handles edit and updateItem", () => {
    renderApp();
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Save"));
  });

  it("handles togglePurchased", () => {
    renderApp();
    fireEvent.click(screen.getByText("Toggle"));
  });

  it("filters search input", () => {
    renderApp();
    fireEvent.change(screen.getByPlaceholderText(/Cari nama/i), {
      target: { value: "sab" },
    });
    expect(screen.getByText("Sabun")).toBeInTheDocument();
  });

  it("handles logout confirmation", () => {
    window.confirm = jest.fn(() => true);
    renderApp();
    fireEvent.click(screen.getByText("Logout"));
    expect(window.confirm).toHaveBeenCalled();
  });

  it("shows loading state", () => {
    appState.loading = true;
    renderApp();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    appState.error = "Something went wrong";
    renderApp();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
