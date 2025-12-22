// Tipos globales de Bemyre

/** Usuario base */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Músico */
export interface Musician extends User {
  instruments: Instrument[];
  genres: Genre[];
  location: Location;
  bio?: string;
  experience?: string;
  availability?: Availability;
  isOnline?: boolean;
}

/** Banda */
export interface Band {
  id: string;
  name: string;
  logo?: string;
  genres: Genre[];
  members: BandMember[];
  location: Location;
  bio?: string;
  createdAt: Date;
}

/** Miembro de banda */
export interface BandMember {
  userId: string;
  role: string;
  instrument: Instrument;
  joinedAt: Date;
}

/** Local/Venue */
export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  location: Location;
  capacity?: number;
  amenities?: string[];
  photos?: string[];
  rating?: number;
}

/** Instrumento */
export interface Instrument {
  id: string;
  name: string;
  category: InstrumentCategory;
  icon?: string;
}

/** Género musical */
export interface Genre {
  id: string;
  name: string;
  color?: string;
}

/** Ubicación */
export interface Location {
  city: string;
  state?: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/** Disponibilidad */
export interface Availability {
  weekdays: boolean;
  weekends: boolean;
  mornings: boolean;
  afternoons: boolean;
  evenings: boolean;
}

/** Tipos de local */
export type VenueType =
  | "rehearsal_room"
  | "concert_hall"
  | "bar"
  | "club"
  | "studio"
  | "outdoor"
  | "other";

/** Categorías de instrumento */
export type InstrumentCategory =
  | "string"
  | "wind"
  | "percussion"
  | "keyboard"
  | "voice"
  | "electronic"
  | "other";

/** Concierto/Evento */
export interface Concert {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  venue: Venue;
  bands: Band[];
  genres: Genre[];
  coverImage?: string;
  ticketPrice?: number;
  ticketUrl?: string;
  isFree?: boolean;
  isSoldOut?: boolean;
  createdAt: Date;
}

/** Estado del concierto */
export type ConcertStatus =
  | "upcoming"
  | "today"
  | "ongoing"
  | "finished"
  | "cancelled";

// =============================================================================
// AYLA DESIGNS TYPES
// =============================================================================

export * from "./ayla";
