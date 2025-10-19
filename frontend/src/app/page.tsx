"use client";

import { Navbar } from "@/components/navbar";
import { Generate } from "@/components/generate";
import { Title } from "@/components/title";

export default function HomePage() {
  return (
    <div className="font-roboto relative flex min-h-screen w-full flex-col bg-[url('/container.png')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <Navbar />
      <main className="relative z-10 flex flex-1 gap-10 flex-col items-center justify-center px-4 py-20 text-center md:py-32">
        <Title>
          <Generate />
        </Title>
      </main>
    </div>
  );
}
