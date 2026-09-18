import "@fontsource-variable/inter";
import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import { ToastProvider } from "@/components/ui/toast";
import { brand } from "@/config/brand";
import { LanguageProvider } from "@/i18n";
import { hexToRgbChannels } from "@/lib/utils";

// Inject brand identity from config — rebranding happens in one place.
// (document.title is managed per-route by PageTitleManager in App.tsx.)
const root = document.documentElement;
root.style.setProperty("--primary", hexToRgbChannels(brand.colors.primary));
root.style.setProperty(
  "--primary-foreground",
  hexToRgbChannels(brand.colors.primaryForeground),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LanguageProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </LanguageProvider>
  </StrictMode>,
);
