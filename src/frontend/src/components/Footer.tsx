import { Activity, AlertTriangle } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmHost =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  return (
    <footer className="border-t border-border/30 bg-background/60 backdrop-blur">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span className="font-display font-semibold text-foreground">
              PhysioAssist
            </span>
            <span className="text-border/80">&bull;</span>
            <span>Clinical AI Platform</span>
          </div>

          {/* Disclaimer */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0" />
            <span>
              Clinical decision-support only &mdash; does not replace licensed
              physiotherapy care.
            </span>
          </div>

          {/* Attribution */}
          <p className="text-xs text-muted-foreground">
            © {year} &bull; Built with{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utmHost}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
