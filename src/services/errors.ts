/**
 * Service-layer error. `status` mirrors the HTTP status (0 = network-level
 * failure) so callers can branch without parsing messages.
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly status = 500,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
