import { mockUser } from "@/mocks/user";
import { delay, ServiceError } from "@/services/mock-transport";
import type { User } from "@/types";

/**
 * Authentication service.
 * Backend contract: POST /auth/login, POST /auth/register, GET /auth/me
 *
 * Mock rules:
 *  - any email + password of 8+ characters signs in
 *  - "fail@nova.dev" simulates a network error (to exercise error UI)
 *  - shorter passwords are rejected as invalid credentials
 */
export interface AuthService {
  login(email: string, password: string): Promise<User>;
  register(name: string, email: string, password: string): Promise<User>;
}

export class InvalidCredentialsError extends ServiceError {
  constructor() {
    super("Invalid email or password.", 401);
    this.name = "InvalidCredentialsError";
  }
}

export const authService: AuthService = {
  async login(email, password) {
    await delay(600, 900);
    if (email.trim().toLowerCase() === "fail@nova.dev") {
      throw new ServiceError(
        "Network error. Please check your connection and try again.",
        0,
      );
    }
    if (password.length < 8) {
      throw new InvalidCredentialsError();
    }
    const localPart = email.split("@")[0] ?? "User";
    const name = email === mockUser.email ? mockUser.name : titleCase(localPart);
    return { name, email };
  },

  async register(name, email, password) {
    await delay(700, 1000);
    if (password.length < 8) {
      throw new ServiceError("Password must be at least 8 characters.", 400);
    }
    return { name, email };
  },
};

function titleCase(value: string): string {
  return value
    .split(/[.\-_]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
