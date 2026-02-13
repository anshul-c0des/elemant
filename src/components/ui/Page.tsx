import { ReactNode } from "react";

interface PageProps {
  children?: ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100%",
      }}
    >
      {children}
    </div>
  );
}
