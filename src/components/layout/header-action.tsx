"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserMenu } from "@/components/layout/user-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface HeaderActionsProps {
  setSidebarOpen?: (open: boolean) => void;
}

export const HeaderActions = ({ setSidebarOpen }: HeaderActionsProps) => {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
      <div
        className={cn(
          "flex md:hidden items-center w-full",
          session?.user && "flex-col gap-4 items-start"
        )}
      >
        {session?.user ? (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="font-medium">{session.user.name}</div>
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  signOut({
                    callbackUrl: `${window.location.origin}/`,
                  });
                }}
                className={cn(
                  "flex items-center gap-3 px-2.5 py-2",
                  buttonVariants({ variant: "ghost", size: "sm" })
                )}
              >
                <LogOut className="size-4" />
                <p className="text-sm">Sign out</p>
              </Link>
            </div>
            <Separator />
          </>
        ) : status == "unauthenticated" ? (
          <Link
            href="/sign-in"
            className="w-full"
            onClick={() => {
              if (setSidebarOpen) setSidebarOpen(false);
            }}
          >
            <Button size="sm" className="inline-flex text-xs w-full">
              Sign in
            </Button>
          </Link>
        ) : (
          <Skeleton className="hidden md:flex h-6 w-6 rounded-full bg-gray-300" />
        )}
      </div>

      <div className="hidden md:inline-flex md:items-center gap-4 h-full">
        {session?.user ? (
          <>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="hidden md:inline-flex font-medium transition-colors text-gray-600 hover:bg-gray-100"
              >
                Dashboard
              </Button>
            </Link>
            <UserMenu user={session.user} />
          </>
        ) : status == "unauthenticated" ? (
          <Link href="/sign-in" className="w-full">
            <Button size="sm" className="inline-flex text-xs">
              Sign in
            </Button>
          </Link>
        ) : (
          <Skeleton className="hidden md:flex self-center h-6 w-6 rounded-full bg-gray-300" />
        )}
      </div>
    </div>
  );
};
