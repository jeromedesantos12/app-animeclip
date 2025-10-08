"use client";

import { ReactNode, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchToken } from "../redux/slices";
import type { AppDispatch, RootState } from "../redux/store";
import { Loading } from "@/components/loading";

export function Protected({ children }: { children: ReactNode }) {
  const { status, data } = useSelector((state: RootState) => state.token);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchToken());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === "succeeded" && !data) {
      router.replace("/login");
    }
    if (status === "failed") {
      router.replace("/login");
    }
  }, [status, data, router]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }
  if (status === "succeeded" && data) {
    return <>{children}</>;
  }
  return null;
}
