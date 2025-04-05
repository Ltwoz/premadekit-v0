"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface SubNavigationMenuProps {
  routes: { label: string; path: string }[];
}

export function SubNavigationMenu({ routes }: SubNavigationMenuProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState({
    translateX: "0px",
    width: "0px",
  });

  const [hoverStyle, setHoverStyle] = useState({
    translateX: "0px",
    width: "0px",
    opacity: 0,
  });

  useEffect(() => {
    const updateIndicator = () => {
      if (containerRef.current) {
        let activeLink: HTMLElement | null = null;
        let longestMatchLength = 0;

        Array.from(containerRef.current.children).forEach((child) => {
          if (child instanceof HTMLAnchorElement) {
            const href = child.getAttribute("href") || "";

            if (pathname.startsWith(href) && href.length > longestMatchLength) {
              longestMatchLength = href.length;
              activeLink = child;
            }
          }
        });

        if (activeLink) {
          const { offsetLeft, offsetWidth } = activeLink;
          setIndicatorStyle({
            translateX: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      }
    };

    updateIndicator();

    window.addEventListener("resize", updateIndicator);

    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [pathname]);

  const handleMouseEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const { offsetLeft, offsetWidth } = event.currentTarget;
    setHoverStyle({
      translateX: `${offsetLeft}px`,
      width: `${offsetWidth}px`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="flex items-center bg-white border-b overflow-x-auto px-4 lg:px-6 sticky top-0 -mt-2.5 z-50">
      <div ref={containerRef} className="flex items-center relative">
        <div
          className="absolute top-0 bottom-0 bg-muted rounded transition-all duration-200 opacity-0 my-2"
          style={{
            transform: `translateX(${hoverStyle.translateX})`,
            width: hoverStyle.width,
            opacity: hoverStyle.opacity,
          }}
        />

        {routes.map((route) => {
          const isActive =
            pathname === route.path ||
            (pathname.startsWith(route.path) &&
              route.path.length > 1 &&
              routes.every(
                (r) =>
                  !(
                    pathname.startsWith(r.path) &&
                    r.path.length > route.path.length
                  )
              ));

          return (
            <Link
              href={route.path}
              key={route.label}
              data-active={isActive}
              className={cn(
                "relative text-sm leading-none px-3 py-4 transition-all select-none rounded",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {route.label}
            </Link>
          );
        })}

        <div
          className="absolute block bottom-0 h-0.5 bg-muted-foreground transition-transform duration-300 flex-shrink-0"
          style={{
            transform: `translateX(${indicatorStyle.translateX})`,
            width: indicatorStyle.width,
          }}
        />
      </div>
    </div>
  );
}
