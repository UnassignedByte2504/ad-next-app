/**
 * Unit Tests - Avatar Component
 *
 * Tests para el componente Avatar:
 * - Renderizado correcto
 * - Tamaños
 * - Estados (online/offline)
 * - Variantes de forma
 * - Accesibilidad
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@tests/utils";
import { Avatar } from "@atoms/Avatar";

describe("Avatar", () => {
  describe("Rendering", () => {
    it("renders with initials when no src", () => {
      render(<Avatar initials="AB" alt="User" />);
      expect(screen.getByText("AB")).toBeInTheDocument();
    });

    it("renders with children when provided", () => {
      render(<Avatar alt="User">JD</Avatar>);
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("renders with image when src is provided", () => {
      render(<Avatar src="/avatar.jpg" alt="User avatar" />);
      const img = screen.getByRole("img", { name: "User avatar" });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "/avatar.jpg");
    });

    it("renders with custom className", () => {
      render(<Avatar initials="A" className="custom-avatar" />);
      const avatar = screen.getByText("A").closest(".MuiAvatar-root");
      expect(avatar?.className).toContain("custom-avatar");
    });
  });

  describe("Sizes", () => {
    it("renders xs size correctly (24px)", () => {
      render(<Avatar initials="A" size="xs" />);
      const avatar = screen.getByText("A").closest(".MuiAvatar-root");
      expect(avatar).toHaveStyle({ width: "24px", height: "24px" });
    });

    it("renders sm size correctly (32px)", () => {
      render(<Avatar initials="A" size="sm" />);
      const avatar = screen.getByText("A").closest(".MuiAvatar-root");
      expect(avatar).toHaveStyle({ width: "32px", height: "32px" });
    });

    it("renders md size correctly (40px - default)", () => {
      render(<Avatar initials="A" />);
      const avatar = screen.getByText("A").closest(".MuiAvatar-root");
      expect(avatar).toHaveStyle({ width: "40px", height: "40px" });
    });

    it("renders lg size correctly (56px)", () => {
      render(<Avatar initials="A" size="lg" />);
      const avatar = screen.getByText("A").closest(".MuiAvatar-root");
      expect(avatar).toHaveStyle({ width: "56px", height: "56px" });
    });

    it("renders xl size correctly (80px)", () => {
      render(<Avatar initials="A" size="xl" />);
      const avatar = screen.getByText("A").closest(".MuiAvatar-root");
      expect(avatar).toHaveStyle({ width: "80px", height: "80px" });
    });
  });

  describe("Variants", () => {
    it("renders circular variant by default", () => {
      render(<Avatar initials="A" />);
      const avatar = screen.getByText("A").closest(".MuiAvatar-root");
      expect(avatar).toHaveClass("MuiAvatar-circular");
    });

    it("renders rounded variant", () => {
      render(<Avatar initials="A" variant="rounded" />);
      const avatar = screen.getByText("A").closest(".MuiAvatar-root");
      expect(avatar).toHaveClass("MuiAvatar-rounded");
    });

    it("renders square variant", () => {
      render(<Avatar initials="A" variant="square" />);
      const avatar = screen.getByText("A").closest(".MuiAvatar-root");
      expect(avatar).toHaveClass("MuiAvatar-square");
    });
  });

  describe("Online Status", () => {
    it("shows online badge when online=true", () => {
      render(<Avatar initials="A" online />);
      const badge = screen.getByText("A").closest(".MuiBadge-root");
      expect(badge).toBeInTheDocument();
    });

    it("shows offline badge when online=false", () => {
      render(<Avatar initials="A" online={false} />);
      const badge = screen.getByText("A").closest(".MuiBadge-root");
      expect(badge).toBeInTheDocument();
    });

    it("does not show badge when online is undefined", () => {
      render(<Avatar initials="A" />);
      const badge = screen.getByText("A").closest(".MuiBadge-root");
      expect(badge).not.toBeInTheDocument();
    });
  });

  describe("Background Color", () => {
    it("applies custom background color", () => {
      render(<Avatar initials="A" bgColor="#FF0000" />);
      const avatar = screen.getByText("A").closest(".MuiAvatar-root");
      expect(avatar).toHaveStyle({ backgroundColor: "rgb(255, 0, 0)" });
    });
  });

  describe("Accessibility", () => {
    it("has alt text when provided", () => {
      render(<Avatar src="/avatar.jpg" alt="John Doe" />);
      const img = screen.getByRole("img", { name: "John Doe" });
      expect(img).toBeInTheDocument();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to the root element", () => {
      const ref = vi.fn();
      render(<Avatar initials="A" ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });
});
