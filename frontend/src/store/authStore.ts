import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiFetch } from "@/lib/api";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (payload) => {
        const data = await apiFetch<{ user: AuthUser & { token: string } }>(
          "/auth/login",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
        );
        const { token, ...user } = data.user;
        set({ user, token });
      },

      logout: () => set({ user: null, token: null }),

      fetchMe: async () => {
        const data = await apiFetch<{ user: AuthUser }>("/auth/me");
        set({ user: data.user });
      },
    }),
    {
      name: "salon-auth",
    },
  ),
);
