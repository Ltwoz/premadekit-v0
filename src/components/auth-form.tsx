"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Circle, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: string;
}

const AuthSchema = z.object({
  email: z.string().email(),
});

export const AuthForm = ({ className, type, ...props }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
  });

  const onSubmit = async (data: z.infer<typeof AuthSchema>) => {
    const signInResponse = await signIn("resend", {
      ...data,
      redirectTo: "/",
    });

    if (!signInResponse?.ok) {
      return toast.error("Something went wrong");
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button
        variant="outline"
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true);
          signIn("google");
        }}
      >
        {isLoading ? (
          <LoaderCircle className="mr-2 size-4 animate-spin" />
        ) : (
          <Circle className="mr-2 size-4" />
        )}{" "}
        Google
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Service unavailable."
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="none"
              disabled={true}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button disabled={true}>
            {type === "signup" ? "Sign up" : "Sign in"} with Email
          </Button>
        </div>
      </form>
    </div>
  );
};
