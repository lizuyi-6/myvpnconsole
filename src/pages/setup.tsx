import { Container } from "@/components/layout/container";
import { SetupGuide } from "@/components/setup/setup-guide";

export function SetupPage() {
  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Set up your device
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Four steps, a few minutes. No account required to read this guide.
      </p>

      <div className="mt-10">
        <SetupGuide />
      </div>
    </Container>
  );
}
