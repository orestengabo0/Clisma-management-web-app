import { create } from "zustand";

type AuthState = {
  token: string | null;
  isAuthenticating: boolean;
  errorMessage: string | null;
  setToken: (token: string | null, remember?: boolean) => void;
  clearAuth: () => void;
  setAuthenticating: (value: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  loadFromStorage: () => void;
};

const STORAGE_KEY = "clisma_auth_token";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticating: false,
  errorMessage: null,
  setToken: (token, remember) => {
    set({ token });
    try {
      if (token && remember) {
        localStorage.setItem(STORAGE_KEY, token);
      } else if (token && !remember) {
        sessionStorage.setItem(STORAGE_KEY, token);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  },
  clearAuth: () => {
    set({ token: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
  setAuthenticating: (value) => set({ isAuthenticating: value }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  loadFromStorage: () => {
    try {
      const persisted = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (persisted) set({ token: persisted });
    } catch {
      // ignore
    }
  },
}));


