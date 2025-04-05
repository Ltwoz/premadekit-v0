"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface UserAccountDropdownProps {
  user: User;
}

export default function UserAccountDropdown({
  user,
}: UserAccountDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-full flex items-center">
        {user.image && (
          <Image
            src={user.image}
            alt="avatar"
            width={24}
            height={24}
            className="rounded-full cursor-pointer"
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="font-medium cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/`,
            });
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
