/** Operational error with a stable machine-readable code for clients. */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const Errors = {
  unauthorized: () =>
    new AppError(401, "UNAUTHORIZED", "Authentication required."),
  invalidCredentials: () =>
    new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password."),
  emailTaken: () =>
    new AppError(409, "EMAIL_TAKEN", "An account with this email already exists."),
  notFound: (what: string) => new AppError(404, "NOT_FOUND", `${what} not found.`),
  noSubscription: () =>
    new AppError(404, "NO_SUBSCRIPTION", "No subscription for this account yet."),
  badPlan: () => new AppError(400, "BAD_PLAN", "Plan not found."),
  validation: (message = "Invalid request body.") =>
    new AppError(400, "VALIDATION", message),
  rateLimited: () =>
    new AppError(429, "RATE_LIMITED", "Too many attempts. Try again later."),
};
