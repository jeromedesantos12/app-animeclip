"use client";

import { Home, LogOut, Search, SearchCheck, History, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { UserType } from "@/types/user";
import { getUserById } from "@/queries/user";
import toast from "react-hot-toast";
import { extractAxiosError } from "@/lib/axios";
import { logoutAuth } from "@/queries/auth";
import { fetchToken } from "@/redux/slices";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/generate", label: "Generate", icon: Search },
  { href: "/history", label: "History", icon: History },
];

export function Aside() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const { data: tokenData } = useSelector((state: RootState) => state.token);

  // --- Fetch user data (mirip dengan Navbar) ---
  useEffect(() => {
    async function fetchUser(id: string) {
      try {
        const userData = await getUserById(id);
        setUser(userData);
      } catch (err) {
        toast.error(extractAxiosError(err));
      }
    }

    if (tokenData) {
      fetchUser(tokenData.id);
    }
  }, [tokenData]);

  // --- Handle Logout ---
  async function handleLogout() {
    setIsSubmitting(true);
    try {
      await logoutAuth();
      toast.success("Logout berhasil!");
      router.push("/login");
      dispatch(fetchToken());
    } catch (err) {
      toast.error(extractAxiosError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <aside className="hidden md:flex flex-col pl-10 w-full max-w-sm bg-background/80 backdrop-blur-lg border-r border-border/50 p-4 text-foreground shrink-0 z-100">
      <div
        onClick={() => router.push("/")}
        className="flex items-center gap-2 px-4 py-2 cursor-pointer mb-8"
      >
        <h1 className="font-bold text-2xl text-foreground">AnimeClip</h1>
        <h1 className="font-medium text-xl text-foreground font-mono">
          Finder
        </h1>
        <SearchCheck className="text-foreground" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-grow">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10",
              pathname === href && "bg-primary/20 text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="mt-auto flex flex-col gap-4">
        <div className="flex  items-center gap-3 px-3 py-2">
          <Image
            src={user?.avatar_url || "/default-avatar.jpg"}
            alt={user?.fullname || "User Avatar"}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
          <span className="font-medium truncate">{user?.fullname}</span>
        </div>
      </div>
      <Button variant="ghost" onClick={handleLogout} loading={isSubmitting}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </aside>
  );
}
