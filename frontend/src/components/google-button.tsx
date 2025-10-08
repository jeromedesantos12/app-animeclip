import { forwardRef, SVGProps } from "react";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Google</title>
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 2.04-4.88 2.04-5.87 0-10.6-4.85-10.6-10.8s4.73-10.8 10.6-10.8c3.36 0 5.52 1.35 6.78 2.54l2.5-2.5C20.1 1.22 16.77 0 12.48 0 5.86 0 0 5.58 0 12s5.86 12 12.48 12c7.25 0 12.08-4.85 12.08-12.25 0-.8-.08-1.55-.2-2.33l-11.9.01z" />
  </svg>
);

export const GoogleButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        variant="outline"
        className={cn("w-full whitespace-normal", className)}
        ref={ref}
        {...props}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        {children || "Continue with Google"}
      </Button>
    );
  }
);
GoogleButton.displayName = "GoogleButton";
