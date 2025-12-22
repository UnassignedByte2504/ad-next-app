/**
 * Integration Tests - API Calls
 *
 * Tests de integración que verifican la comunicación con la API
 * usando MSW para mockear las respuestas.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { server } from "@tests/mocks";
import { http, HttpResponse } from "msw";

const API_URL = "http://localhost:3000/api";

describe("Musicians API Integration", () => {
  describe("GET /musicians", () => {
    it("fetches musicians list successfully", async () => {
      const response = await fetch(`${API_URL}/musicians`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveProperty("data");
      expect(data).toHaveProperty("pagination");
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("supports pagination parameters", async () => {
      const response = await fetch(`${API_URL}/musicians?page=2&limit=5`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.pagination.page).toBe(2);
      expect(data.pagination.limit).toBe(5);
    });

    it("supports filtering by genre", async () => {
      const response = await fetch(`${API_URL}/musicians?genre=jazz`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      data.data.forEach((musician: { genres: string[] }) => {
        expect(musician.genres).toContain("jazz");
      });
    });

    it("supports filtering by instrument", async () => {
      const response = await fetch(`${API_URL}/musicians?instrument=guitar`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      data.data.forEach((musician: { instruments: string[] }) => {
        expect(musician.instruments).toContain("guitar");
      });
    });
  });

  describe("GET /musicians/:id", () => {
    it("fetches a single musician by id", async () => {
      const response = await fetch(`${API_URL}/musicians/musician-1`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveProperty("id", "musician-1");
      expect(data).toHaveProperty("name");
      expect(data).toHaveProperty("instruments");
      expect(data).toHaveProperty("genres");
    });

    it("returns 404 for non-existent musician", async () => {
      const response = await fetch(`${API_URL}/musicians/not-found`);

      expect(response.status).toBe(404);
    });
  });

  describe("POST /musicians", () => {
    it("creates a new musician profile", async () => {
      const newMusician = {
        name: "New Musician",
        email: "new@bemyre.com",
        instruments: ["drums"],
        genres: ["rock"],
      };

      const response = await fetch(`${API_URL}/musicians`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMusician),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty("id");
      expect(data.name).toBe(newMusician.name);
    });
  });

  describe("PATCH /musicians/:id", () => {
    it("updates a musician profile", async () => {
      const updates = {
        bio: "Updated bio",
        instruments: ["guitar", "piano"],
      };

      const response = await fetch(`${API_URL}/musicians/musician-1`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.bio).toBe(updates.bio);
      expect(data.instruments).toEqual(updates.instruments);
    });
  });
});

describe("Auth API Integration", () => {
  describe("POST /auth/login", () => {
    it("logs in with valid credentials", async () => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@bemyre.com",
          password: "password123",
        }),
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveProperty("user");
      expect(data).toHaveProperty("token");
      expect(data.user.email).toBe("test@bemyre.com");
    });

    it("returns 401 for invalid credentials", async () => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "wrong@email.com",
          password: "wrongpassword",
        }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /auth/me", () => {
    it("returns current user with valid token", async () => {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: "Bearer valid-token" },
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("email");
    });

    it("returns 401 without token", async () => {
      const response = await fetch(`${API_URL}/auth/me`);

      expect(response.status).toBe(401);
    });
  });
});

describe("Catalog API Integration", () => {
  describe("GET /genres", () => {
    it("fetches all music genres", async () => {
      const response = await fetch(`${API_URL}/genres`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty("id");
      expect(data[0]).toHaveProperty("name");
    });
  });

  describe("GET /instruments", () => {
    it("fetches all instruments", async () => {
      const response = await fetch(`${API_URL}/instruments`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toHaveProperty("id");
      expect(data[0]).toHaveProperty("name");
      expect(data[0]).toHaveProperty("category");
    });
  });
});

describe("Error Handling", () => {
  beforeEach(() => {
    // Reset handlers before each test in this describe
    server.resetHandlers();
  });

  it("handles network errors gracefully", async () => {
    // Override handler to simulate network error
    server.use(
      http.get(`${API_URL}/musicians`, () => {
        return HttpResponse.error();
      })
    );

    await expect(fetch(`${API_URL}/musicians`)).rejects.toThrow();
  });

  it("handles 500 server errors", async () => {
    server.use(
      http.get(`${API_URL}/musicians`, () => {
        return HttpResponse.json({ error: "Internal Server Error" }, { status: 500 });
      })
    );

    const response = await fetch(`${API_URL}/musicians`);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Internal Server Error");
  });

  it("handles timeout scenarios", async () => {
    server.use(
      http.get(`${API_URL}/musicians`, async () => {
        // Simular timeout largo (no usar en tests reales, solo ejemplo)
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json({ data: [] });
      })
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50);

    await expect(
      fetch(`${API_URL}/musicians`, { signal: controller.signal })
    ).rejects.toThrow();

    clearTimeout(timeoutId);
  });
});
