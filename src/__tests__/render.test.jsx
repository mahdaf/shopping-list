import React from "react";
import * as ReactDOMClient from "react-dom/client";

jest.mock("react-dom/client", () => ({
  createRoot: jest.fn().mockReturnValue({
    render: jest.fn(),
  }),
}));

describe("index.jsx", () => {
  it("calls ReactDOM.createRoot and renders Root", async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await import("../index");

    expect(ReactDOMClient.createRoot).toHaveBeenCalled();
    expect(ReactDOMClient.createRoot().render).toHaveBeenCalled();
  });
});
