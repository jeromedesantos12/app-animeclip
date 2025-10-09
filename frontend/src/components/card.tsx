import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
}

export function Card({
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
  contentClassName,
}: CardProps) {
  return (
    <div
      className={cn(
        "w-full md:w-[480px] shrink-0 h-fit bg-primary-foreground py-10 px-8 rounded-xl flex flex-col gap-8 shadow-xl border",
        className
      )}
    >
      <div className="flex flex-col gap-1 text-foreground">
        <h2
          className={cn(
            "text-lg font-semibold text-background",
            titleClassName
          )}
        >
          {title}
        </h2>
        <p className={cn("text-lg text-background", descriptionClassName)}>
          {description}
        </p>
      </div>
      <div className={cn("w-full", contentClassName)}>{children}</div>
    </div>
  );
}
