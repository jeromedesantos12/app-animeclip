import type { ReactNode } from "react";

export function Container({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex">
      <div className="bg-[url('/container.png')] bg-cover md:w-full bg-left bg-no-repeat"></div>
      <div className="bg-background w-full flex flex-col justify-center items-center min-h-screen">
        <div className="bg-primary-foreground py-10 px-8 w-full max-w-sm rounded-xl flex flex-col gap-8 shadow-xl border">
          <div className="flex flex-col justify-center items-center gap-2 text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
