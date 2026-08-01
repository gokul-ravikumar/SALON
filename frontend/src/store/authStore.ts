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

interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
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

      register: async (payload) => {
        await apiFetch<{ user: AuthUser }>("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        const data = await apiFetch<{ user: AuthUser & { token: string } }>(
          "/auth/login",
          {
            method: "POST",
            body: JSON.stringify({
              email: payload.email,
              password: payload.password,
            }),
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
