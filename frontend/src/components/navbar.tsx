// import defaultAvatar from "@/default-avatar.jpg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, SearchCheck } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [base64Image, setBase64Image] = useState<string | null>(null);

  async function handleLogout() {}

  return (
    <div className="fixed flex justify-center top-0 bg-black shadow-2xl backdrop-blur-2xl w-full">
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
        <div className="flex gap-5 justify-center items-center">
          {/* <Image
              onClick={() => router.push("/profile")}
              src={base64Image || defaultAvatar}
              alt={`Image of ${profile?.full_name || "user"}`}
              width={50}
              height={50}
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            /> */}
          <button
            onClick={handleLogout}
            className="bg-blue-400 hover:bg-blue-300 duration-300 cursor-pointer text-black font-medium py-1 px-3 text-sm rounded-lg flex  justify-center not-only-of-type:items-center gap-2"
          >
            <LogOut />
            <p>Logout</p>
          </button>
        </div>
      </div>
    </div>
  );
}
