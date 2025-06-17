import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import EditForm from "../components/EditForm";

describe("EditForm", () => {
  const editedTask = {
    nama: "Kopi",
    harga: "12000",
    jumlah: "2",
    img: "img.jpg",
  };
  const updateTask = jest.fn();
  const closeEditMode = jest.fn();

  beforeEach(() => {
    updateTask.mockClear();
    closeEditMode.mockClear();
    global.alert = jest.fn();
  });

  it("renders input fields with initial values", () => {
    render(<EditForm editedTask={editedTask} updateTask={updateTask} closeEditMode={closeEditMode} />);
    expect(screen.getByLabelText(/Update Nama Barang/i)).toHaveValue("Kopi");
    expect(screen.getByLabelText(/Update Harga Barang/i)).toHaveValue(12000);
    expect(screen.getByLabelText(/Update Jumlah Barang/i)).toHaveValue(2);
  });

  it("can update values and submit", () => {
    render(<EditForm editedTask={editedTask} updateTask={updateTask} closeEditMode={closeEditMode} />);
    fireEvent.input(screen.getByLabelText(/Update Nama Barang/i), { target: { value: "Teh" } });
    fireEvent.input(screen.getByLabelText(/Update Harga Barang/i), { target: { value: "8000" } });
    fireEvent.input(screen.getByLabelText(/Update Jumlah Barang/i), { target: { value: "3" } });

    fireEvent.submit(screen.getByTestId("form"));

    expect(updateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        nama: "Teh",
        harga: "8000",
        jumlah: "3",
      })
    );
  });

  it("calls closeEditMode when Escape is pressed", () => {
    render(<EditForm editedTask={editedTask} updateTask={updateTask} closeEditMode={closeEditMode} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(closeEditMode).toHaveBeenCalled();
  });

  it("calls closeEditMode when backdrop is clicked", () => {
    const { container } = render(
      <EditForm editedTask={editedTask} updateTask={updateTask} closeEditMode={closeEditMode} />
    );
    fireEvent.click(container.firstChild);
    expect(closeEditMode).toHaveBeenCalled();
  });

  it("alerts if invalid image type is uploaded", () => {
    render(<EditForm editedTask={editedTask} updateTask={updateTask} closeEditMode={closeEditMode} />);
    const fileInput = screen.getByLabelText(/Update Gambar/i);

    const invalidFile = new File(["test"], "test.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    expect(global.alert).toHaveBeenCalledWith("Hanya file JPG, JPEG, dan PNG yang diperbolehkan.");
  });

  it("alerts if file size is too large", () => {
    render(<EditForm editedTask={editedTask} updateTask={updateTask} closeEditMode={closeEditMode} />);
    const fileInput = screen.getByLabelText(/Update Gambar/i);

    const bigFile = new File(["a".repeat(2 * 1024 * 1024)], "big.png", { type: "image/png" });
    Object.defineProperty(bigFile, "size", { value: 2 * 1024 * 1024 });
    fireEvent.change(fileInput, { target: { files: [bigFile] } });
    expect(global.alert).toHaveBeenCalledWith("Ukuran file tidak boleh lebih dari 1 MB.");
  });

  it("handles clearing file input (file is undefined)", () => {
    render(<EditForm editedTask={editedTask} updateTask={updateTask} closeEditMode={closeEditMode} />);
    const fileInput = screen.getByLabelText(/Update Gambar/i);

    // Simulasi file di-clear (files: [])
    fireEvent.change(fileInput, { target: { files: [] } });
    // Tidak error/alert
    expect(global.alert).not.toHaveBeenCalled();
  });

  it("uploads valid image (simulate FileReader)", async () => {
    render(<EditForm editedTask={editedTask} updateTask={updateTask} closeEditMode={closeEditMode} />);
    const fileInput = screen.getByLabelText(/Update Gambar/i);

    const validFile = new File(["dummy"], "img.jpg", { type: "image/jpeg" });
    Object.defineProperty(validFile, "size", { value: 1000 });
    // Patch FileReader
    const readerMock = {
      readAsDataURL: jest.fn(),
      result: "data:image/jpeg;base64,xxx",
      onloadend: null,
    };
    window.FileReader = jest.fn(() => readerMock);

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    // Simulasi onloadend berjalan dengan act()
    if (readerMock.onloadend) {
      await act(async () => {
        readerMock.onloadend();
      });
    }
    expect(readerMock.readAsDataURL).toHaveBeenCalled();
  });
});