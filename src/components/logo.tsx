import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
}

export const Logo = ({ className, href = "/" }: LogoProps) => {
  return (
    <Link href={href} className={cn(className)}>
      <div className="flex items-center gap-x-1.5 text-primary">
        <Image src="/logo.svg" alt="Logo" height={24} width={24} />
        <span className="font-grotesk text-xl font-bold">premadekit</span>
      </div>
    </Link>
  );
};
