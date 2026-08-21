import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account, rendering preferences, and API integrations.
        </p>
      </div>

      <div className="border border-dashed border-border rounded-xl p-16 text-center bg-card/30 space-y-4">
        <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-semibold text-lg">Settings Panel</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Account preferences, rendering quality options, AI API key
            configuration, and export settings will be available here in the
            next phase.
          </p>
        </div>
      </div>
    </div>
  );
}
