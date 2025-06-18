import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
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
  items: [
    { id: "1", nama: "Sabun", harga: 3000, jumlah: 2, isPurchased: false },
    { id: "2", nama: "Sampo", harga: 15000, jumlah: 1, isPurchased: true },
    { id: "3", nama: "Pasta Gigi", harga: 8000, jumlah: 3, isPurchased: false },
  ],
};

// Dynamic mock useFirestoreCollection
jest.mock("../hooks/useFirestoreCollection", () => {
  const addItem = jest.fn();
  const updateItem = jest.fn();
  const deleteItem = jest.fn();
  return {
    __esModule: true,
    default: () => ({
      items: appState.items,
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
  return (
    <div>
      <button onClick={() => addItem({ nama: "Sabun", harga: 3000, jumlah: 2 })}>Add Valid Item</button>
      <button onClick={() => addItem({ nama: "", harga: "", jumlah: "" })}>Add Invalid Item</button>
      <button onClick={() => addItem({ nama: "Test", harga: 1000, jumlah: 1 })}>Add Test Item</button>
    </div>
  );
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
        <span>Harga: {item.harga}</span>
        <span>Jumlah: {item.jumlah}</span>
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
    appState.items = [
      { id: "1", nama: "Sabun", harga: 3000, jumlah: 2, isPurchased: false },
      { id: "2", nama: "Sampo", harga: 15000, jumlah: 1, isPurchased: true },
      { id: "3", nama: "Pasta Gigi", harga: 8000, jumlah: 3, isPurchased: false },
    ];
  });

  it("renders content", () => {
    renderApp();
    expect(screen.getByText(/Daftar/i)).toBeInTheDocument();
    expect(screen.getByText("Sabun")).toBeInTheDocument();
  });

  it("handles addItem with valid data", () => {
    renderApp();
    fireEvent.click(screen.getByText("Add Valid Item"));
  });

  it("handles addItem with invalid data and shows alert", () => {
    window.alert = jest.fn();
    renderApp();
    fireEvent.click(screen.getByText("Add Invalid Item"));
    expect(window.alert).toHaveBeenCalledWith("Semua field harus diisi!");
  });

  it("handles deleteItem", () => {
    renderApp();
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
  });

  it("handles edit and updateItem", () => {
    renderApp();
    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText("Save"));
  });

  it("handles togglePurchased", () => {
    renderApp();
    const toggleButtons = screen.getAllByText("Toggle");
    fireEvent.click(toggleButtons[0]);
  });

  it("filters search input", () => {
    renderApp();
    fireEvent.change(screen.getByPlaceholderText(/Cari nama/i), {
      target: { value: "sab" },
    });
    expect(screen.getByText("Sabun")).toBeInTheDocument();
  });

  it("handles logout confirmation", async () => {
    window.confirm = jest.fn(() => true);
    renderApp();
    
    await act(async () => {
      fireEvent.click(screen.getByText("Logout"));
    });
    
    expect(window.confirm).toHaveBeenCalled();
  });

  it("handles logout cancellation", async () => {
    window.confirm = jest.fn(() => false);
    renderApp();
    
    await act(async () => {
      fireEvent.click(screen.getByText("Logout"));
    });
    
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

  it("handles sorting by name ascending", () => {
    renderApp();
    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "nama-asc" } });
    expect(sortSelect.value).toBe("nama-asc");
  });

  it("handles sorting by name descending", () => {
    renderApp();
    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "nama-desc" } });
    expect(sortSelect.value).toBe("nama-desc");
  });

  it("handles sorting by price ascending", () => {
    renderApp();
    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "harga-asc" } });
    expect(sortSelect.value).toBe("harga-asc");
  });

  it("handles sorting by price descending", () => {
    renderApp();
    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "harga-desc" } });
    expect(sortSelect.value).toBe("harga-desc");
  });

  it("handles sorting by quantity ascending", () => {
    renderApp();
    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "jumlah-asc" } });
    expect(sortSelect.value).toBe("jumlah-asc");
  });

  it("handles sorting by quantity descending", () => {
    renderApp();
    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "jumlah-desc" } });
    expect(sortSelect.value).toBe("jumlah-desc");
  });

  it("handles default sorting", () => {
    renderApp();
    const sortSelect = screen.getByRole("combobox");
    fireEvent.change(sortSelect, { target: { value: "default" } });
    expect(sortSelect.value).toBe("default");
  });

  it("handles user with email", () => {
    renderApp();
    expect(screen.getByText(/Daftar Belanja Test/i)).toBeInTheDocument();
  });

  // it("handles search with no results", () => {
  //   renderApp();
  //   fireEvent.change(screen.getByPlaceholderText(/Cari nama/i), {
  //     target: { value: "xyz" },
  //   });
  //   expect(screen.getByText("Menampilkan 0 dari 3 barang belanja")).toBeInTheDocument();
  // });

  // it("handles search with empty query", () => {
  //   renderApp();
  //   fireEvent.change(screen.getByPlaceholderText(/Cari nama/i), {
  //     target: { value: "" },
  //   });
  //   expect(screen.getByText("Menampilkan Total 3 barang belanja")).toBeInTheDocument();
  // });

    // it("displays item count correctly", () => {
  //   renderApp();
  //   expect(screen.getByText("Menampilkan Total 3 barang belanja")).toBeInTheDocument();
  // });

  // it("displays filtered item count when searching", () => {
  //   renderApp();
  //   fireEvent.change(screen.getByPlaceholderText(/Cari nama/i), {
  //     target: { value: "sab" },
  //   });
  //   expect(screen.getByText("Menampilkan 1 dari 3 barang belanja")).toBeInTheDocument();
  // });

  it("handles togglePurchased with item not found", () => {
    // Mock items with specific ID
    appState.items = [
      { id: "1", nama: "Sabun", harga: 3000, jumlah: 2, isPurchased: false },
    ];
    
    renderApp();
    const toggleButtons = screen.getAllByText("Toggle");
    fireEvent.click(toggleButtons[0]);
  });

  it("handles edit mode close", () => {
    renderApp();
    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText("Close"));
  });
});
