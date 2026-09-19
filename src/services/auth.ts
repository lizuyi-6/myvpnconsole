import { api, setAuthToken } from "@/lib/api-client";
import { ServiceError } from "@/services/errors";
import type { User } from "@/types";

/**
 * Authentication service.
 * API: POST /auth/login, POST /auth/register, POST /auth/logout, GET /auth/me
 */
export interface AuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  register(name: string, email: string, password: string): Promise<AuthResponse>;
  logout(): Promise<void>;
}

export class InvalidCredentialsError extends ServiceError {
  constructor() {
    super("Invalid email or password.", 401);
    this.name = "InvalidCredentialsError";
  }
}

export class EmailTakenError extends ServiceError {
  constructor() {
    super("An account with this email already exists.", 409);
    this.name = "EmailTakenError";
  }
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService: AuthService = {
  async login(email, password) {
    try {
      const res = await api<AuthResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setAuthToken(res.token);
      return res;
    } catch (err) {
      if (err instanceof ServiceError && err.status === 401) {
        throw new InvalidCredentialsError();
      }
      throw err;
    }
  },

  async register(name, email, password) {
    try {
      const res = await api<AuthResponse>("/auth/register", {
        method: "POST",
        body: { name, email, password },
      });
      setAuthToken(res.token);
      return res;
    } catch (err) {
      if (err instanceof ServiceError && err.status === 409) {
        throw new EmailTakenError();
      }
      throw err;
    }
  },

  async logout() {
    try {
      await api<void>("/auth/logout", { method: "POST" });
    } finally {
      setAuthToken(null);
    }
  },
};
