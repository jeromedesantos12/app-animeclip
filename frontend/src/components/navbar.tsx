import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, SearchCheck } from "lucide-react";
import { Button } from "./button";
import toast from "react-hot-toast";
import { extractAxiosError } from "@/lib/axios";
import { getUserById } from "@/queries/user";
import { logoutAuth } from "@/queries/auth";
import { fetchToken } from "@/redux/slices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { UserType } from "@/types/user";

export function Navbar() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userById, setUserById] = useState<UserType | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const { data } = useSelector((state: RootState) => state.token);

  async function handleLogout() {
    setIsSubmitting(true);
    try {
      await logoutAuth();
    } catch (err) {
      toast.error(extractAxiosError(err));
    } finally {
      toast.success("User logout successfully!");
      router.push("/login");
      dispatch(fetchToken());
      setIsSubmitting(false);
    }
  }

  async function fetchUser(id: string) {
    try {
      const user = await getUserById(id);
      setUserById(user);
    } catch (err) {
      toast.error(extractAxiosError(err));
    }
  }

  useEffect(() => {
    if (data) {
      fetchUser(data.id);
    }
  }, [data]);

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
        <div className="flex gap-5 justify-center items-center">
          <Image
            onClick={() => router.push("/dashboard")}
            src={base64Image || "/default-avatar.jpg"}
            alt={`Image of ${userById?.fullname || "user"}`}
            width={50}
            height={50}
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
          />
          <Button
            loading={isSubmitting}
            className="rounded-full"
            onClick={handleLogout}
          >
            <LogOut />
            <p>Logout</p>
          </Button>
        </div>
      </div>
    </div>
  );
}
