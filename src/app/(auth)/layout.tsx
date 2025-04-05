import { getCurrentSession } from "@/lib//auth/session";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentSession();

  if (user) {
    redirect("/");
  }

  return <div className="min-h-screen">{children}</div>;
}
