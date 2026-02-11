import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children?: ReactNode;
}

export default function Card({ title = "Card", children }: CardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}
