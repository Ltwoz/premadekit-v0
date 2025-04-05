import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "./premadekit/modal";

export function RootProvider({
  theme,
  children,
}: React.PropsWithChildren<{
  theme?: string;
}>) {
  return (
    <SessionProvider>
      <ModalProvider>{children}</ModalProvider>
    </SessionProvider>
  );
}
