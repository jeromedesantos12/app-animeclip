import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { type FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  error?: FieldError;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          className={cn(
            "bg-muted rounded-lg py-3 pr-4 w-full border placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            icon ? "pl-12" : "pl-4",
            error && "border-destructive border-2",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
