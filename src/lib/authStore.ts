import { create } from "zustand";

type AuthState = {
  token: string | null; // access token (back-compat field)
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticating: boolean;
  errorMessage: string | null;
  setToken: (token: string | null, remember?: boolean) => void; // back-compat
  setTokens: (accessToken: string | null, refreshToken: string | null, remember?: boolean) => void;
  setAccessToken: (accessToken: string | null, remember?: boolean) => void;
  clearAuth: () => void;
  setAuthenticating: (value: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  loadFromStorage: () => void;
};

const ACCESS_STORAGE_KEY = "clisma_auth_access_token";
const REFRESH_STORAGE_KEY = "clisma_auth_refresh_token";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticating: false,
  errorMessage: null,
  setToken: (token, remember) => {
    // Back-compat: set only access token
    set({ token, accessToken: token });
    try {
      if (token && remember) {
        localStorage.setItem(ACCESS_STORAGE_KEY, token);
        sessionStorage.removeItem(ACCESS_STORAGE_KEY);
      } else if (token && !remember) {
        sessionStorage.setItem(ACCESS_STORAGE_KEY, token);
        localStorage.removeItem(ACCESS_STORAGE_KEY);
      } else {
        localStorage.removeItem(ACCESS_STORAGE_KEY);
        sessionStorage.removeItem(ACCESS_STORAGE_KEY);
      }
    } catch {
      // ignore storage errors
    }
  },
  setTokens: (accessToken, refreshToken, remember) => {
    set({ token: accessToken, accessToken, refreshToken });
    try {
      if (accessToken && refreshToken) {
        if (remember) {
          localStorage.setItem(ACCESS_STORAGE_KEY, accessToken);
          localStorage.setItem(REFRESH_STORAGE_KEY, refreshToken);
          sessionStorage.removeItem(ACCESS_STORAGE_KEY);
          sessionStorage.removeItem(REFRESH_STORAGE_KEY);
        } else {
          sessionStorage.setItem(ACCESS_STORAGE_KEY, accessToken);
          sessionStorage.setItem(REFRESH_STORAGE_KEY, refreshToken);
          localStorage.removeItem(ACCESS_STORAGE_KEY);
          localStorage.removeItem(REFRESH_STORAGE_KEY);
        }
      } else {
        localStorage.removeItem(ACCESS_STORAGE_KEY);
        localStorage.removeItem(REFRESH_STORAGE_KEY);
        sessionStorage.removeItem(ACCESS_STORAGE_KEY);
        sessionStorage.removeItem(REFRESH_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  },
  setAccessToken: (accessToken, remember) => {
    set((state) => ({ token: accessToken, accessToken }));
    try {
      if (accessToken) {
        if (remember) {
          localStorage.setItem(ACCESS_STORAGE_KEY, accessToken);
          sessionStorage.removeItem(ACCESS_STORAGE_KEY);
        } else {
          sessionStorage.setItem(ACCESS_STORAGE_KEY, accessToken);
          localStorage.removeItem(ACCESS_STORAGE_KEY);
        }
      } else {
        localStorage.removeItem(ACCESS_STORAGE_KEY);
        sessionStorage.removeItem(ACCESS_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  },
  clearAuth: () => {
    set({ token: null, accessToken: null, refreshToken: null });
    try {
      localStorage.removeItem(ACCESS_STORAGE_KEY);
      localStorage.removeItem(REFRESH_STORAGE_KEY);
      sessionStorage.removeItem(ACCESS_STORAGE_KEY);
      sessionStorage.removeItem(REFRESH_STORAGE_KEY);
    } catch {
      // ignore
    }
  },
  setAuthenticating: (value) => set({ isAuthenticating: value }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  loadFromStorage: () => {
    try {
      const persistedAccess = localStorage.getItem(ACCESS_STORAGE_KEY) || sessionStorage.getItem(ACCESS_STORAGE_KEY);
      const persistedRefresh = localStorage.getItem(REFRESH_STORAGE_KEY) || sessionStorage.getItem(REFRESH_STORAGE_KEY);
      if (persistedAccess) {
        set({ token: persistedAccess, accessToken: persistedAccess });
      }
      if (persistedRefresh) {
        set({ refreshToken: persistedRefresh });
      }
    } catch {
      // ignore
    }
  },
}));


