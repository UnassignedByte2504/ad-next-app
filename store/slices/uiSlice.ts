/**
 * UI Slice - Estado de la interfaz de usuario
 *
 * Maneja:
 * - Tema (light/dark/system)
 * - Sidebar
 * - Notificaciones toast
 * - Modales
 * - Estado de conexión
 */

import type { StateCreator } from "zustand";
import type { StoreState, UISlice, UIState, Notification, Modal, ThemeMode } from "../types";
import { generateId } from "@utils";

const initialState: UIState = {
  theme: "system",
  sidebarOpen: true,
  sidebarCollapsed: false,
  notifications: [],
  modals: [],
  isOnline: true,
  isMobile: false,
};

export const createUISlice: StateCreator<
  StoreState,
  [["zustand/immer", never], ["zustand/devtools", never]],
  [],
  UISlice
> = (set) => ({
  ...initialState,

  setTheme: (theme: ThemeMode) => {
    set((state) => {
      state.ui.theme = theme;
    });
    // DOM mutation moved to useThemeSync hook
    // The hook subscribes to theme changes and applies them to document.documentElement
  },

  toggleSidebar: () => {
    set((state) => {
      state.ui.sidebarOpen = !state.ui.sidebarOpen;
    });
  },

  setSidebarOpen: (open: boolean) => {
    set((state) => {
      state.ui.sidebarOpen = open;
    });
  },

  setSidebarCollapsed: (collapsed: boolean) => {
    set((state) => {
      state.ui.sidebarCollapsed = collapsed;
    });
  },

  addNotification: (notification: Omit<Notification, "id">) => {
    const id = generateId();

    set((state) => {
      state.ui.notifications.push({ ...notification, id });
    });

    // Auto-remove después de duration (default 5s)
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => {
          state.ui.notifications = state.ui.notifications.filter((n) => n.id !== id);
        });
      }, duration);
    }

    return id;
  },

  removeNotification: (id: string) => {
    set((state) => {
      state.ui.notifications = state.ui.notifications.filter((n) => n.id !== id);
    });
  },

  clearNotifications: () => {
    set((state) => {
      state.ui.notifications = [];
    });
  },

  openModal: (modal: Omit<Modal, "id">) => {
    const id = generateId();

    set((state) => {
      state.ui.modals.push({ ...modal, id });
    });

    return id;
  },

  closeModal: (id: string) => {
    set((state) => {
      state.ui.modals = state.ui.modals.filter((m) => m.id !== id);
    });
  },

  closeAllModals: () => {
    set((state) => {
      state.ui.modals = [];
    });
  },

  setOnline: (online: boolean) => {
    set((state) => {
      state.ui.isOnline = online;
    });
  },

  setMobile: (mobile: boolean) => {
    set((state) => {
      state.ui.isMobile = mobile;
    });
  },
});
