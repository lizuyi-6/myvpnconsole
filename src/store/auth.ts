import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken, UNAUTHORIZED_EVENT } from "@/lib/api-client";
import { authService } from "@/services/auth";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      async signIn(email, password) {
        const { user, token } = await authService.login(email, password);
        set({ user, token });
      },

      async register(name, email, password) {
        const { user, token } = await authService.register(name, email, password);
        set({ user, token });
      },

      signOut() {
        // Revoke server-side; UI state clears immediately either way.
        void authService.logout().catch(() => undefined);
        setAuthToken(null);
        set({ user: null, token: null });
      },
    }),
    {
      name: "nova.auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        setAuthToken(state?.token ?? null);
      },
    },
  ),
);

// A 401 anywhere in the app means the session died (expired or revoked) —
// drop the local copy so route guards send the user to /login.
if (typeof window !== "undefined") {
  window.addEventListener(UNAUTHORIZED_EVENT, () => {
    setAuthToken(null);
    useAuthStore.setState({ user: null, token: null });
  });
}
