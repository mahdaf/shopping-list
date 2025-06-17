import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeSwitcher from "../components/ThemeSwitcher";

// Mock CSS module
jest.mock("../components/ThemeSwitcher.module.css", () => ({
  wrapper: "mocked-wrapper",
  btns: "mocked-btns",
  picker: "mocked-picker",
  close: "mocked-close",
}));

// Mock heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  XMarkIcon: () => <svg data-testid="icon-x" />,
  SunIcon: () => <svg data-testid="icon-sun" />,
  MoonIcon: () => <svg data-testid="icon-moon" />,
  SwatchIcon: () => <svg data-testid="icon-swatch" />,
}));

// Mock useLocalStorage custom hook
const mockUseLocalStorage = jest.fn();
jest.mock("../hooks/useLocalStorage", () => ({
  __esModule: true,
  default: (...args) => mockUseLocalStorage(...args),
}));

// Helper to reset mocks and set default values
beforeEach(() => {
  jest.clearAllMocks();
  // Selalu mock matchMedia
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  // Selalu mock useLocalStorage
  let hue = "240";
  let theme = "light";
  mockUseLocalStorage.mockImplementation((key, initial) => {
    if (key === "react-todo.color") return [hue, (v) => (hue = v)];
    if (key === "react-todo.theme") return [theme, (v) => (theme = v)];
    return [initial, () => {}];
  });
  document.documentElement.setAttribute("color-scheme", "");
  document.documentElement.style.setProperty("--_hue", "");
});

describe("ThemeSwitcher", () => {
  it("renders theme switch and color pick buttons", () => {
    render(<ThemeSwitcher />);
    expect(
      screen.getByRole("switch", { name: /change theme to dark mode/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /enable color picking mode/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("icon-moon")).toBeInTheDocument();
    expect(screen.getByTestId("icon-swatch")).toBeInTheDocument();
  });

  it("toggles theme when theme button is clicked", () => {
    let theme = "light";
    mockUseLocalStorage.mockImplementation((key, initial) => {
      if (key === "react-todo.color") return ["240", jest.fn()];
      if (key === "react-todo.theme") return [
        theme,
        (v) => {
          theme = v;
          document.documentElement.setAttribute("color-scheme", v);
        }
      ];
      return [initial, () => {}];
    });
    render(<ThemeSwitcher />);
    const themeBtn = screen.getByRole("switch", {
      name: /change theme to dark mode/i,
    });
    fireEvent.click(themeBtn);
    expect(document.documentElement.getAttribute("color-scheme")).toBe("dark");
  });

  it("shows color picker when color pick button is clicked", () => {
    render(<ThemeSwitcher />);
    const colorBtn = screen.getByRole("button", { name: /enable color picking mode/i });
    fireEvent.click(colorBtn);
    expect(screen.getByRole("button", { name: /close color picking mode/i })).toBeInTheDocument();
    expect(screen.getByTestId("icon-x")).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /change color theme slider/i })).toBeInTheDocument();
  });

  it("changes hue when slider is moved", () => {
    let hue = "240";
    mockUseLocalStorage.mockImplementation((key, initial) => {
      if (key === "react-todo.color") return [hue, (v) => {
        hue = v;
        document.documentElement.style.setProperty("--_hue", v);
      }];
      if (key === "react-todo.theme") return ["light", jest.fn()];
      return [initial, jest.fn()];
    });
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /enable color picking mode/i }));
    const slider = screen.getByRole("slider", { name: /change color theme slider/i });
    fireEvent.input(slider, { target: { value: "120" } });
    expect(document.documentElement.style.getPropertyValue("--_hue")).toBe("120");
  });

  it("closes color picker when close button is clicked", () => {
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /enable color picking mode/i }));
    const closeBtn = screen.getByRole("button", { name: /close color picking mode/i });
    fireEvent.click(closeBtn);
    // Kembali ke mode awal (dua tombol utama)
    expect(
      screen.getByRole("switch", { name: /change theme to dark mode/i })
    ).toBeInTheDocument();
  });

  it("sets theme to dark if prefers-color-scheme is dark", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true, // Simulasi dark mode
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    let theme = "dark";
    mockUseLocalStorage.mockImplementation((key, initial) => {
      if (key === "react-todo.color") return ["240", jest.fn()];
      if (key === "react-todo.theme") return [theme, (v) => (theme = v)];
      return [initial, () => {}];
    });
    render(<ThemeSwitcher />);
    expect(screen.getByTestId("icon-sun")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: /change theme to light mode/i })).toBeInTheDocument();
  });

  it("toggles theme from dark to light", () => {
    let theme = "dark";
    mockUseLocalStorage.mockImplementation((key, initial) => {
      if (key === "react-todo.color") return ["240", jest.fn()];
      if (key === "react-todo.theme") return [theme, (v) => {
        theme = v;
        document.documentElement.setAttribute("color-scheme", v);
      }];
      return [initial, () => {}];
    });
    render(<ThemeSwitcher />);
    const themeBtn = screen.getByRole("switch", { name: /change theme to light mode/i });
    fireEvent.click(themeBtn);
    expect(document.documentElement.getAttribute("color-scheme")).toBe("light");
  });

  it("slider min and max value works", () => {
    let hue = "240";
    mockUseLocalStorage.mockImplementation((key, initial) => {
      if (key === "react-todo.color") return [hue, (v) => {
        hue = v;
        document.documentElement.style.setProperty("--_hue", v);
      }];
      if (key === "react-todo.theme") return ["light", jest.fn()];
      return [initial, jest.fn()];
    });
    render(<ThemeSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /enable color picking mode/i }));
    const slider = screen.getByRole("slider", { name: /change color theme slider/i });
    fireEvent.input(slider, { target: { value: "0" } });
    expect(document.documentElement.style.getPropertyValue("--_hue")).toBe("0");
    fireEvent.input(slider, { target: { value: "360" } });
    expect(document.documentElement.style.getPropertyValue("--_hue")).toBe("360");
  });
});
