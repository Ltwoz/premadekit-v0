import Link from "next/link";
import { User } from "next-auth";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface UserMenuProps {
  user: User;
}

export const UserMenu = ({ user }: UserMenuProps) => {
  return (
    <>
      <DropdownMenu modal={false}>
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
          <DropdownMenuItem>
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                signOut({
                  callbackUrl: `${window.location.origin}/`,
                });
              }}
              className="font-medium"
            >
              Sign out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
