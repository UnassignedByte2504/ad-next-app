/**
 * MSW Handlers - Definición de mocks para API requests
 *
 * Aquí se definen los handlers que interceptarán las peticiones HTTP
 * durante los tests. Organizado por dominio/feature.
 */

import { http, HttpResponse, delay } from "msw";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// ============================================
// Auth Handlers
// ============================================

const authHandlers = [
  // Login
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    // Simular delay de red
    await delay(100);

    if (body.email === "test@bemyre.com" && body.password === "password123") {
      return HttpResponse.json({
        user: {
          id: "user-1",
          email: "test@bemyre.com",
          name: "Test User",
          role: "musician",
        },
        token: "mock-jwt-token",
      });
    }

    return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }),

  // Logout
  http.post(`${API_URL}/auth/logout`, async () => {
    await delay(50);
    return HttpResponse.json({ success: true });
  }),

  // Get current user
  http.get(`${API_URL}/auth/me`, async ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return HttpResponse.json({
      id: "user-1",
      email: "test@bemyre.com",
      name: "Test User",
      role: "musician",
    });
  }),
];

// ============================================
// Musicians Handlers
// ============================================

const musiciansHandlers = [
  // List musicians
  http.get(`${API_URL}/musicians`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    const genre = url.searchParams.get("genre");
    const instrument = url.searchParams.get("instrument");

    await delay(100);

    const musicians = generateMockMusicians(limit, { genre, instrument });

    return HttpResponse.json({
      data: musicians,
      pagination: {
        page,
        limit,
        total: 100,
        totalPages: 10,
      },
    });
  }),

  // Get single musician
  http.get(`${API_URL}/musicians/:id`, async ({ params }) => {
    const { id } = params;

    await delay(50);

    if (id === "not-found") {
      return HttpResponse.json({ error: "Musician not found" }, { status: 404 });
    }

    return HttpResponse.json({
      id,
      name: "Mock Musician",
      email: "musician@bemyre.com",
      bio: "Este es un músico de prueba para los tests",
      instruments: ["guitar", "bass"],
      genres: ["rock", "jazz"],
      location: {
        city: "Madrid",
        state: "Madrid",
        country: "Spain",
      },
      avatar: "/avatars/default.png",
      createdAt: "2024-01-15T10:30:00Z",
    });
  }),

  // Create musician profile
  http.post(`${API_URL}/musicians`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    await delay(100);

    return HttpResponse.json(
      {
        id: "new-musician-id",
        ...body,
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  // Update musician profile
  http.patch(`${API_URL}/musicians/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;

    await delay(100);

    return HttpResponse.json({
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  }),
];

// ============================================
// Bands Handlers
// ============================================

const bandsHandlers = [
  // List bands
  http.get(`${API_URL}/bands`, async () => {
    await delay(100);

    return HttpResponse.json({
      data: [
        {
          id: "band-1",
          name: "The Mock Band",
          genre: "rock",
          members: 4,
          description: "Una banda de prueba",
        },
        {
          id: "band-2",
          name: "Jazz Collective",
          genre: "jazz",
          members: 6,
          description: "Colectivo de jazz experimental",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    });
  }),

  // Get single band
  http.get(`${API_URL}/bands/:id`, async ({ params }) => {
    const { id } = params;

    await delay(50);

    return HttpResponse.json({
      id,
      name: "The Mock Band",
      description: "Una banda de prueba para tests",
      genre: "rock",
      members: [
        { id: "user-1", name: "Test User", instrument: "guitar", role: "leader" },
        { id: "user-2", name: "Jane Doe", instrument: "bass", role: "member" },
      ],
      createdAt: "2024-01-01T00:00:00Z",
    });
  }),
];

// ============================================
// Venues Handlers
// ============================================

const venuesHandlers = [
  // List venues
  http.get(`${API_URL}/venues`, async () => {
    await delay(100);

    return HttpResponse.json({
      data: [
        {
          id: "venue-1",
          name: "Sala Rock",
          type: "concert_hall",
          capacity: 500,
          location: { city: "Madrid", address: "Calle Principal 123" },
        },
        {
          id: "venue-2",
          name: "Estudio 54",
          type: "rehearsal_room",
          capacity: 10,
          location: { city: "Barcelona", address: "Av. Diagonal 456" },
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    });
  }),
];

// ============================================
// Genres & Instruments Handlers
// ============================================

const catalogHandlers = [
  http.get(`${API_URL}/genres`, async () => {
    return HttpResponse.json([
      { id: "rock", name: "Rock" },
      { id: "jazz", name: "Jazz" },
      { id: "blues", name: "Blues" },
      { id: "metal", name: "Metal" },
      { id: "pop", name: "Pop" },
      { id: "classical", name: "Classical" },
      { id: "electronic", name: "Electronic" },
      { id: "folk", name: "Folk" },
    ]);
  }),

  http.get(`${API_URL}/instruments`, async () => {
    return HttpResponse.json([
      { id: "guitar", name: "Guitar", category: "string" },
      { id: "bass", name: "Bass", category: "string" },
      { id: "drums", name: "Drums", category: "percussion" },
      { id: "piano", name: "Piano", category: "keys" },
      { id: "vocals", name: "Vocals", category: "voice" },
      { id: "saxophone", name: "Saxophone", category: "wind" },
      { id: "violin", name: "Violin", category: "string" },
    ]);
  }),
];

// ============================================
// Helper Functions
// ============================================

interface MockMusicianOptions {
  genre?: string | null;
  instrument?: string | null;
}

function generateMockMusicians(count: number, options: MockMusicianOptions = {}) {
  const musicians = [];

  for (let i = 0; i < count; i++) {
    musicians.push({
      id: `musician-${i + 1}`,
      name: `Musician ${i + 1}`,
      email: `musician${i + 1}@bemyre.com`,
      instruments: options.instrument ? [options.instrument] : ["guitar"],
      genres: options.genre ? [options.genre] : ["rock"],
      location: { city: "Madrid", country: "Spain" },
      avatar: `/avatars/musician-${i + 1}.png`,
    });
  }

  return musicians;
}

// ============================================
// Export All Handlers
// ============================================

export const handlers = [
  ...authHandlers,
  ...musiciansHandlers,
  ...bandsHandlers,
  ...venuesHandlers,
  ...catalogHandlers,
];
