import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[oklch(0.72_0.17_195/0.1)] bg-[oklch(0.13_0.025_240/0.5)] backdrop-blur">
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-[oklch(0.72_0.17_195)]" />
            <span className="font-display font-semibold text-foreground">
              PhysioAssist
            </span>
            <span>&bull; Clinical AI Platform</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[oklch(0.72_0.17_195)] hover:underline"
            >
              caffeine.ai
            </a>{" "}
            &bull; Does not replace licensed physiotherapy care
          </p>
        </div>
      </div>
    </footer>
  );
}
