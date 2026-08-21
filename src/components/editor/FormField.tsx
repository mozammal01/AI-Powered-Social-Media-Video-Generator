import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, htmlFor, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground leading-none"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-destructive font-medium">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function TextInput({ className, hasError, ...props }: TextInputProps) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm",
        "placeholder:text-muted-foreground/60",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        hasError
          ? "border-destructive focus-visible:ring-destructive/50"
          : "border-input",
        className
      )}
      {...props}
    />
  );
}

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function TextArea({ className, hasError, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-lg border bg-background px-3 py-2 text-sm",
        "placeholder:text-muted-foreground/60 resize-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        hasError
          ? "border-destructive focus-visible:ring-destructive/50"
          : "border-input",
        className
      )}
      {...props}
    />
  );
}