/**
 * Field-level validation message.
 * `role="alert"` makes screen readers announce it the moment it appears;
 * pair the input with `aria-describedby={id}` so the association is explicit.
 */
export function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-xs text-danger">
      {message}
    </p>
  );
}
