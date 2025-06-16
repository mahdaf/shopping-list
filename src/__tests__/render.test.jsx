import * as ReactDOMClient from "react-dom/client";

// Mock createRoot dan render agar tidak benar-benar mounting ke DOM asli
const mockRender = jest.fn();
jest.spyOn(ReactDOMClient, "createRoot").mockReturnValue({
  render: mockRender,
});

describe("render.jsx", () => {
  it("calls ReactDOM.createRoot and renders Root", async () => {
    // Siapkan root element di document
    document.body.innerHTML = '<div id="root"></div>';
    
    // Import langsung render.jsx untuk memicu eksekusi kode mounting
    await import("../render"); // Import sesuai path file render.jsx

    // Cek bahwa createRoot dan render dipanggil
    expect(ReactDOMClient.createRoot).toHaveBeenCalledWith(document.getElementById("root"));
    expect(mockRender).toHaveBeenCalled();
  });
});