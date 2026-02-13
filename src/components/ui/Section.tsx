import { ReactNode } from "react";

interface SectionProps {
  title: string;
  children?: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {title && (
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#000" }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
