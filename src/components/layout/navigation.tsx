"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

import { HeaderActions } from "@/components/layout/header-action";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";

const routes = [
  {
    href: "/pricing",
    label: "Pricing",
  },
  {
    href: "/doc",
    label: "Documentation",
  },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isMobile } = useMediaQuery();

  const onClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-fit md:w-full flex items-center justify-between">
      <nav className="hidden md:flex gap-6">
        {routes.map((route, index) => (
          <Link
            key={index}
            href={route.href}
            prefetch={true}
            className="text-lg font-medium transition-colors text-gray-600 hover:text-gray-900 sm:text-base"
          >
            {route.label}
          </Link>
        ))}
      </nav>
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-gray-600" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle />
            </SheetHeader>
            <nav className="flex flex-col gap-4">
              <div className="flex flex-col">
                {routes.map((route, index) => (
                  <Link
                    key={index}
                    href={route.href}
                    prefetch={true}
                    onClick={onClick}
                    className="text-base font-medium transition-colors text-gray-600 hover:bg-gray-100 rounded-lg px-2 py-3"
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
              <Separator />
              <HeaderActions setSidebarOpen={setIsOpen} />
            </nav>
          </SheetContent>
        </Sheet>
      )}
      {!isMobile && (
        <div className="hidden md:inline-flex">
          <HeaderActions />
        </div>
      )}
    </div>
  );
};
