import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function Card({ children, className, contentClassName }: CardProps) {
  return (
    <div
      className={cn(
        "w-full md:w-[480px] shrink-0 h-fit bg-primary-foreground py-10 px-8 rounded-xl flex flex-col gap-8 shadow-xl border",
        className
      )}
    >
      <div className={cn("w-full", contentClassName)}>{children}</div>
    </div>
  );
}
