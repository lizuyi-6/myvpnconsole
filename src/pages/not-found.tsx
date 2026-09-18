import { Link } from "react-router-dom";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

export function NotFoundPage() {
  const { t } = useI18n();
  return (
    <Container className="flex flex-col items-center py-28 text-center">
      <p className="font-mono text-xs tracking-widest text-subtle">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {t("notFound.title")}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">{t("notFound.body")}</p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link to="/">{t("notFound.backHome")}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/plans">{t("notFound.viewPlans")}</Link>
        </Button>
      </div>
    </Container>
  );
}
