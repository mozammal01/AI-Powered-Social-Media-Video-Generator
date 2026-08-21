import { Layers } from "lucide-react";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Video Templates</h1>
        <p className="text-muted-foreground text-sm">Choose from a variety of professionally designed video layouts.</p>
      </div>

      <div className="border border-dashed border-border rounded-xl p-16 text-center bg-card/30 space-y-4">
        <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Layers className="w-6 h-6" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-semibold text-lg">Templates Gallery</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The template customizer gallery is coming soon! You will be able to search and filter through presets, TikTok reels, YouTube Shorts, and corporate ads.
          </p>
        </div>
      </div>
    </div>
  );
}
