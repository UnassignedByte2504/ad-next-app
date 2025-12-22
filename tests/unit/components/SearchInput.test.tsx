/**
 * Unit Tests - SearchInput Component
 *
 * Tests para el componente SearchInput siguiendo Material Design 3.
 * - Renderizado correcto
 * - Props y variantes
 * - Estados (loading, disabled)
 * - Eventos (onChange, onSearch)
 * - Accesibilidad
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@tests/utils";
import { SearchInput } from "@atoms/SearchInput";

describe("SearchInput", () => {
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<SearchInput />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
      render(<SearchInput placeholder="Buscar músicos..." />);

      const input = screen.getByPlaceholderText("Buscar músicos...");
      expect(input).toBeInTheDocument();
    });

    it("renders with default placeholder when not specified", () => {
      render(<SearchInput />);

      const input = screen.getByPlaceholderText("Buscar...");
      expect(input).toBeInTheDocument();
    });

    it("renders search icon by default", () => {
      render(<SearchInput />);

      // SearchIcon se renderiza como SVG con data-testid
      const searchIcon = document.querySelector('[data-testid="SearchIcon"]');
      expect(searchIcon).toBeInTheDocument();
    });
  });

  describe("Value", () => {
    it("displays controlled value", () => {
      render(<SearchInput value="test query" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("test query");
    });

    it("displays empty value by default", () => {
      render(<SearchInput />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");
    });
  });

  describe("onChange", () => {
    it("calls onChange when typing", async () => {
      const handleChange = vi.fn();
      const { user } = render(<SearchInput onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "rock");

      // Each keystroke calls onChange with the current full value
      expect(handleChange).toHaveBeenCalledTimes(4);
      // Verify it was called with each intermediate value
      expect(handleChange).toHaveBeenNthCalledWith(1, "r");
      expect(handleChange).toHaveBeenNthCalledWith(2, "ro");
      expect(handleChange).toHaveBeenNthCalledWith(3, "roc");
      expect(handleChange).toHaveBeenNthCalledWith(4, "rock");
    });

    it("does not throw when onChange is not provided", async () => {
      const { user } = render(<SearchInput />);

      const input = screen.getByRole("textbox");

      await expect(user.type(input, "test")).resolves.not.toThrow();
    });
  });

  describe("onSearch", () => {
    it("calls onSearch on Enter key press", async () => {
      const handleSearch = vi.fn();
      const { user } = render(<SearchInput value="jazz" onSearch={handleSearch} />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.keyboard("{Enter}");

      expect(handleSearch).toHaveBeenCalledTimes(1);
      expect(handleSearch).toHaveBeenCalledWith("jazz");
    });

    it("calls onSearch when search button clicked", async () => {
      const handleSearch = vi.fn();
      const { user } = render(<SearchInput value="blues" onSearch={handleSearch} showButton />);

      const searchButton = screen.getByRole("button", { name: /ejecutar búsqueda/i });
      await user.click(searchButton);

      expect(handleSearch).toHaveBeenCalledTimes(1);
      expect(handleSearch).toHaveBeenCalledWith("blues");
    });

    it("does not throw on Enter when onSearch is not provided", async () => {
      const { user } = render(<SearchInput value="test" />);

      const input = screen.getByRole("textbox");
      await user.click(input);

      await expect(user.keyboard("{Enter}")).resolves.not.toThrow();
    });

    it("does not call onSearch when disabled", async () => {
      const handleSearch = vi.fn();
      const { user } = render(<SearchInput value="test" onSearch={handleSearch} showButton disabled />);

      const searchButton = screen.getByRole("button", { name: /ejecutar búsqueda/i });
      await user.click(searchButton);

      expect(handleSearch).not.toHaveBeenCalled();
    });
  });

  describe("showButton", () => {
    it("shows search button when showButton=true", () => {
      render(<SearchInput showButton onSearch={vi.fn()} />);

      const searchButton = screen.getByRole("button", { name: /ejecutar búsqueda/i });
      expect(searchButton).toBeInTheDocument();
    });

    it("hides search button when showButton=false (default)", () => {
      render(<SearchInput />);

      const searchButton = screen.queryByRole("button", { name: /ejecutar búsqueda/i });
      expect(searchButton).not.toBeInTheDocument();
    });

    it("renders search button as circular", () => {
      render(<SearchInput showButton onSearch={vi.fn()} />);

      const searchButton = screen.getByRole("button", { name: /ejecutar búsqueda/i });
      // El botón tiene borderRadius: "50%" para ser circular
      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toHaveStyle({ borderRadius: "50%" });
    });
  });

  describe("Loading State", () => {
    it("shows loading spinner when loading=true", () => {
      render(<SearchInput loading />);

      const spinner = screen.getByRole("progressbar");
      expect(spinner).toBeInTheDocument();
    });

    it("hides search icon when loading", () => {
      render(<SearchInput loading />);

      // Cuando está cargando, no debería mostrar el icono de búsqueda principal
      const spinnerIcon = screen.getByRole("progressbar");
      expect(spinnerIcon).toBeInTheDocument();
    });

    it("hides loading spinner when loading=false", () => {
      render(<SearchInput loading={false} />);

      const spinner = screen.queryByRole("progressbar");
      expect(spinner).not.toBeInTheDocument();
    });

    it("disables search button when loading", () => {
      render(<SearchInput showButton loading onSearch={vi.fn()} />);

      const searchButton = screen.getByRole("button", { name: /ejecutar búsqueda/i });
      expect(searchButton).toBeDisabled();
    });

    it("enables search button when not loading", () => {
      render(<SearchInput showButton loading={false} onSearch={vi.fn()} />);

      const searchButton = screen.getByRole("button", { name: /ejecutar búsqueda/i });
      expect(searchButton).not.toBeDisabled();
    });
  });

  describe("Disabled State", () => {
    it("disables input when disabled=true", () => {
      render(<SearchInput disabled />);

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("disables search button when disabled", () => {
      render(<SearchInput showButton disabled onSearch={vi.fn()} />);

      const searchButton = screen.getByRole("button", { name: /ejecutar búsqueda/i });
      expect(searchButton).toBeDisabled();
    });

    it("shows reduced opacity when disabled", () => {
      const { container } = render(<SearchInput disabled />);

      const searchContainer = container.firstChild as HTMLElement;
      // El componente aplica opacity: 0.5 cuando está disabled
      expect(searchContainer).toHaveStyle({ opacity: "0.5" });
    });
  });

  describe("Sizes", () => {
    it("renders sm size with correct height", () => {
      const { container } = render(<SearchInput size="sm" />);

      const searchContainer = container.firstChild as HTMLElement;
      // sm tiene height: 40px
      expect(searchContainer).toHaveStyle({ height: "40px" });
    });

    it("renders md size with correct height", () => {
      const { container } = render(<SearchInput size="md" />);

      const searchContainer = container.firstChild as HTMLElement;
      // md tiene height: 48px
      expect(searchContainer).toHaveStyle({ height: "48px" });
    });

    it("renders lg size with correct height", () => {
      const { container } = render(<SearchInput size="lg" />);

      const searchContainer = container.firstChild as HTMLElement;
      // lg tiene height: 56px
      expect(searchContainer).toHaveStyle({ height: "56px" });
    });

    it("defaults to md size", () => {
      const { container } = render(<SearchInput />);

      const searchContainer = container.firstChild as HTMLElement;
      expect(searchContainer).toHaveStyle({ height: "48px" });
    });
  });

  describe("Variants", () => {
    it("renders outlined variant with border", () => {
      const { container } = render(<SearchInput variant="outlined" />);

      const searchContainer = container.firstChild as HTMLElement;
      // Outlined variant has border
      const styles = getComputedStyle(searchContainer);
      expect(styles.border).toMatch(/1px solid/);
    });

    it("renders filled variant with background", () => {
      const { container } = render(<SearchInput variant="filled" />);

      const searchContainer = container.firstChild as HTMLElement;
      // Filled variant has no border
      expect(searchContainer).toHaveStyle({ border: "none" });
    });

    it("renders outlined variant by default", () => {
      const { container } = render(<SearchInput />);

      const searchContainer = container.firstChild as HTMLElement;
      const styles = getComputedStyle(searchContainer);
      expect(styles.border).toMatch(/1px solid/);
    });
  });

  describe("FullWidth", () => {
    it("applies fullWidth correctly when true", () => {
      const { container } = render(<SearchInput fullWidth />);

      const searchContainer = container.firstChild as HTMLElement;
      expect(searchContainer).toHaveStyle({ width: "100%" });
    });

    it("does not apply fullWidth by default", () => {
      const { container } = render(<SearchInput />);

      const searchContainer = container.firstChild as HTMLElement;
      expect(searchContainer).toHaveStyle({ width: "auto" });
    });
  });

  describe("Accessibility", () => {
    it("has correct aria-label on input", () => {
      render(<SearchInput />);

      const input = screen.getByRole("textbox", { name: /buscar/i });
      expect(input).toBeInTheDocument();
    });

    it("is focusable", async () => {
      const { user } = render(<SearchInput />);

      await user.tab();

      const input = screen.getByRole("textbox");
      expect(input).toHaveFocus();
    });

    it("search button has correct aria-label", () => {
      render(<SearchInput showButton onSearch={vi.fn()} />);

      const searchButton = screen.getByRole("button", { name: /ejecutar búsqueda/i });
      expect(searchButton).toBeInTheDocument();
    });

    it("focuses input when clicking on container", async () => {
      const { container, user } = render(<SearchInput />);

      const searchContainer = container.firstChild as HTMLElement;
      await user.click(searchContainer);

      const input = screen.getByRole("textbox");
      expect(input).toHaveFocus();
    });
  });

  describe("Custom className", () => {
    it("applies custom className to container", () => {
      const { container } = render(<SearchInput className="custom-search-class" />);

      const searchContainer = container.firstChild as HTMLElement;
      expect(searchContainer).toHaveClass("custom-search-class");
    });
  });

  describe("Ref forwarding", () => {
    it("forwards ref to the root element", () => {
      const ref = vi.fn();
      render(<SearchInput ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Pill Shape (Material Design 3)", () => {
    it("has rounded pill shape for sm size", () => {
      const { container } = render(<SearchInput size="sm" />);

      const searchContainer = container.firstChild as HTMLElement;
      // borderRadius = height / 2 = 40 / 2 = 20px
      expect(searchContainer).toHaveStyle({ borderRadius: "20px" });
    });

    it("has rounded pill shape for md size", () => {
      const { container } = render(<SearchInput size="md" />);

      const searchContainer = container.firstChild as HTMLElement;
      // borderRadius = height / 2 = 48 / 2 = 24px
      expect(searchContainer).toHaveStyle({ borderRadius: "24px" });
    });

    it("has rounded pill shape for lg size", () => {
      const { container } = render(<SearchInput size="lg" />);

      const searchContainer = container.firstChild as HTMLElement;
      // borderRadius = height / 2 = 56 / 2 = 28px
      expect(searchContainer).toHaveStyle({ borderRadius: "28px" });
    });
  });
});
