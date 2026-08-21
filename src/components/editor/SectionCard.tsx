import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function SectionCard({ title, description, icon, children }: SectionCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
              {icon}
            </div>
          )}
          <div className="space-y-0.5">
            <h3 className="font-semibold text-sm tracking-tight">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}