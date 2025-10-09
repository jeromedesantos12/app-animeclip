import { ReactNode } from "react";

export function Dashboard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full relative min-h-screen bg-[url('/cover.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative z-10 flex justify-center min-h-screen p-4">
        {children}
      </div>
    </div>
  );
}
