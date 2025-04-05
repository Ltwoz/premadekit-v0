import Link from "next/link";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function SignUpPage() {
  return (
    <div className="container px-4 mx-auto flex h-screen w-full flex-col items-center justify-center">
      <Link
        href="/sign-in"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Sign in
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo className="mx-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign up to your account
          </p>
        </div>
        <Suspense>
          <AuthForm type="signup" />
        </Suspense>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-brand underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-brand underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
