import { useRouter } from "next/navigation";
import { SearchCheck } from "lucide-react";

export function Navbar() {
  const router = useRouter();

  return (
    <div
      className="fixed flex justify-center top-0 w-full z-50 h-24"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))",
      }}
    >
      <div className="flex justify-between gap-10 items-center w-full py-5 px-10">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="flex gap-1">
            <h1 className="font-bold text-2xl text-white">AnimeClip</h1>
            <h1 className="font-medium text-xl text-white font-mono">Finder</h1>
            <SearchCheck className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
