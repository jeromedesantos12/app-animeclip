"use client";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Public } from "@/middleware/public";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/schemas/login";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { PasswordInput } from "@/components/password-input";
import { Container } from "@/components/container";
import { extractAxiosError } from "@/lib/axios";
import { loginAuth } from "@/queries/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchToken } from "@/redux/slices";
import { GoogleButton } from "@/components/google-button";

export default function LoginPage() {
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL as string;
  const dispatch: AppDispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  async function onSubmit(formData: LoginFormValues) {
    try {
      await loginAuth(formData);
      toast.success("User login successfully!");
    } catch (err) {
      toast.error(extractAxiosError(err));
    } finally {
      router.push("/generate");
      dispatch(fetchToken());
    }
  }

  return (
    <Public>
      <Container title="Login" description="Log back in and see what's new.">
        <div className="flex flex-col gap-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <div className="flex flex-col gap-1">
              <Input
                type="text"
                placeholder="Email or Username"
                icon={<User />}
                error={errors.emailOrUsername}
                {...register("emailOrUsername")}
              />
              {errors.emailOrUsername && (
                <p className="text-destructive text-sm font-medium">
                  {errors.emailOrUsername.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <PasswordInput
                placeholder="Password"
                autoComplete="new-password"
                error={errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-sm font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-center mt-2">
              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full rounded-full"
                size="lg"
              >
                Login
              </Button>
            </div>
          </form>
          <GoogleButton
            onClick={() => router.push(`${baseURL}/auth/google`)}
            className="w-full rounded-full"
            size="lg"
          >
            Continue with Google
          </GoogleButton>
          <p>
            Have no account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-primary font-medium hover:text-chart-1 duration-300 cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </Container>
    </Public>
  );
}
