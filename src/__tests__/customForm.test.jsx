import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CustomForm from "../components/CustomForm";

describe("CustomForm", () => {
  const addItem = jest.fn();

  beforeEach(() => {
    addItem.mockClear();
    global.alert = jest.fn();
  });

  it("renders all input fields", () => {
    render(<CustomForm addItem={addItem} />);
    expect(screen.getByLabelText(/Item Belanja/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Harga Barang/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Jumlah Barang/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unggah Gambar/i)).toBeInTheDocument();
  });

  it("can input data and submit, resets after submit", () => {
    render(<CustomForm addItem={addItem} />);
    fireEvent.change(screen.getByLabelText(/Item Belanja/i), { target: { value: "Roti" } });
    fireEvent.change(screen.getByLabelText(/Harga Barang/i), { target: { value: "10000" } });
    fireEvent.change(screen.getByLabelText(/Jumlah Barang/i), { target: { value: "5" } });

    fireEvent.submit(screen.getByTestId("form"));

    expect(addItem).toHaveBeenCalledWith(
      expect.objectContaining({
        nama: "Roti",
        harga: "10000",
        jumlah: "5",
        img: expect.any(String),
      })
    );
    expect(screen.getByLabelText(/Item Belanja/i)).toHaveValue("");
    expect(screen.getByLabelText(/Harga Barang/i)).toHaveValue(null); // input number kosong = null
    expect(screen.getByLabelText(/Jumlah Barang/i)).toHaveValue(null);
  });

  it("calls addItem with DEFAULT_IMG if no image uploaded", () => {
    render(<CustomForm addItem={addItem} />);
    fireEvent.change(screen.getByLabelText(/Item Belanja/i), { target: { value: "Beras" } });
    fireEvent.change(screen.getByLabelText(/Harga Barang/i), { target: { value: "15000" } });
    fireEvent.change(screen.getByLabelText(/Jumlah Barang/i), { target: { value: "1" } });
    // tidak upload gambar
    fireEvent.submit(screen.getByTestId("form"));
    expect(addItem).toHaveBeenCalledWith(
      expect.objectContaining({
        img: expect.stringContaining("shop.png")
      })
    );
  });

  it("shows alert when uploading wrong image type", () => {
    render(<CustomForm addItem={addItem} />);
    const fileInput = screen.getByLabelText(/Unggah Gambar/i);

    const invalidFile = new File(["data"], "doc.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    expect(global.alert).toHaveBeenCalledWith("Hanya file JPG, JPEG, dan PNG yang diperbolehkan.");
  });

  it("shows alert when uploading too large image", () => {
    render(<CustomForm addItem={addItem} />);
    const fileInput = screen.getByLabelText(/Unggah Gambar/i);

    const bigFile = new File(["a".repeat(2 * 1024 * 1024)], "big.jpg", { type: "image/jpeg" });
    Object.defineProperty(bigFile, "size", { value: 2 * 1024 * 1024 });
    fireEvent.change(fileInput, { target: { files: [bigFile] } });
    expect(global.alert).toHaveBeenCalledWith("Ukuran file tidak boleh lebih dari 1 MB.");
  });

  it("handles clearing file input (file is undefined)", () => {
    render(<CustomForm addItem={addItem} />);
    const fileInput = screen.getByLabelText(/Unggah Gambar/i);

    // Simulasi file di-clear (files: [])
    fireEvent.change(fileInput, { target: { files: [] } });
    // Tidak error/alert
    expect(global.alert).not.toHaveBeenCalled();
  });

  it("uploads valid image (simulate FileReader)", async () => {
    render(<CustomForm addItem={addItem} />);
    const fileInput = screen.getByLabelText(/Unggah Gambar/i);

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