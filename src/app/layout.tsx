import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Elemant",
  description: "AI based UI generator",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
