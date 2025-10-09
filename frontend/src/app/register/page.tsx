"use client";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Mail, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Public } from "@/middleware/public";
import { useRouter } from "next/navigation";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../schemas/register";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { PasswordInput } from "@/components/password-input";
import { Container } from "@/components/container";
import { registerAuth } from "@/queries/auth";
import { extractAxiosError } from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData: RegisterFormValues) {
    const { fullname, username, email, password } = formData;
    try {
      await registerAuth({ fullname, username, email, password });
      toast.success("User registered successfully!");
    } catch (err) {
      toast.error(extractAxiosError(err));
    } finally {
      reset();
      router.push("/login");
    }
  }

  return (
    <Public>
      <Container
        title="Register"
        description="New here? Get started in just a few steps."
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              placeholder="Full Name"
              icon={<User />}
              error={errors.fullname}
              {...register("fullname")}
            />
            {errors.fullname && (
              <p className="text-destructive text-sm font-medium">
                {errors.fullname.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              placeholder="Username"
              icon={<User />}
              error={errors.username}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-destructive text-sm font-medium">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Input
              type="email"
              placeholder="Email"
              icon={<Mail />}
              error={errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-sm font-medium">
                {errors.email.message}
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
          <div className="flex flex-col gap-1">
            <PasswordInput
              placeholder="Confirm Password"
              autoComplete="new-password"
              error={errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm font-medium">
                {errors.confirmPassword.message}
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
              Register
            </Button>
            <p>
              Already have account?{" "}
              <span
                onClick={() => router.push("/login")}
                className=" text-primary hover:text-chart-1 font-medium  duration-300 cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </Container>
    </Public>
  );
}
