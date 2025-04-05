import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-background">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
