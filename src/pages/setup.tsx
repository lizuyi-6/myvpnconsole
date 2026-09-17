import { Container } from "@/components/layout/container";
import { SetupGuide } from "@/components/setup/setup-guide";

export function SetupPage() {
  return (
    <Container className="max-w-[1000px] py-14 md:py-20">
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Set up your device
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Four steps, a few minutes. No account required to read this guide.
        </p>
      </div>

      <div className="mt-10 max-w-3xl rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <SetupGuide />
      </div>
    </Container>
  );
}
