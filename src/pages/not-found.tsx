import { Link } from "react-router-dom";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <Container className="flex flex-col items-center py-28 text-center">
      <p className="font-mono text-xs tracking-widest text-subtle">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        This page doesn't exist
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The link may be broken or the page may have moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link to="/">Back to home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/plans">View plans</Link>
        </Button>
      </div>
    </Container>
  );
}
