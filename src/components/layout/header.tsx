import { Logo } from "@/components/logo";
import { Navigation } from "@/components/layout/navigation";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-transparent transition-all backdrop-blur">
      <div className="max-w-screen-xl mx-auto h-16 px-4 py-4 flex items-center justify-between gap-6 lg:gap-10">
        <div className="w-fit flex-shrink-0">
          <Logo />
        </div>
        <Navigation />
      </div>
    </header>
  );
};
