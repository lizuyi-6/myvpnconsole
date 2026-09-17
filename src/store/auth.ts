import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/auth";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      async signIn(email, password) {
        const user = await authService.login(email, password);
        set({ user });
      },

      async register(name, email, password) {
        const user = await authService.register(name, email, password);
        set({ user });
      },

      signOut() {
        set({ user: null });
      },
    }),
    { name: "nova.auth" },
  ),
);
