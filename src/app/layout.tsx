import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Elemant | AI UI Generator",
  description: "AI based UI generator",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
