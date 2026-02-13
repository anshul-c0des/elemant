import { ReactNode } from "react";

interface MainProps {
  children?: ReactNode;
}

export default function Main({ children }: MainProps) {
  return (
    <div
      style={{
        flex: 1,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {children}
    </div>
  );
}
