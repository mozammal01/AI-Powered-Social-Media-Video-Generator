import { cn } from "@/lib/utils";

interface OptionToggleOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface OptionToggleProps<T extends string> {
  label: string;
  value: T;
  options: OptionToggleOption<T>[];
  onChange: (value: T) => void;
  error?: string;
}

export function OptionToggle<T extends string>({
  label,
  value,
  options,
  onChange,
  error,
}: OptionToggleProps<T>) {
  return (
    <div className="space-y-1.5">
      <p className="block text-sm font-medium text-foreground leading-none">
        {label}
      </p>
      <div
        className={cn(
          "grid gap-2",
          options.length === 3 ? "grid-cols-3" : "grid-cols-2"
        )}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
              value === option.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            <span className="font-semibold">{option.label}</span>
            {option.hint && (
              <span className="text-[10px] opacity-70">{option.hint}</span>
            )}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}
