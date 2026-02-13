import { ReactNode } from "react";

interface SidebarProps {
  title?: string;
  children?: ReactNode;
}

export default function Sidebar({
  title = "Sidebar",
  children,
}: SidebarProps) {
  return (
    <div
      style={{
        width: "200px",
        padding: "16px",
        background: "#f4f4f4",
        borderRight: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <strong>{title}</strong>
      {children}
    </div>
  );
}
