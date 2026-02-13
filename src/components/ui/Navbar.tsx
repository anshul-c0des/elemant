import { ReactNode } from "react";

interface NavbarProps {
    title?: string;
    children?: ReactNode;
  }
  
  export default function Navbar({ title = "Navbar", children }: NavbarProps) {
    return (
      <div
      style={{
        padding: "12px 16px",
        background: "#111",
        color: "#fff",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <span>{title}</span>
      <div style={{ display: "flex", gap: "8px" }}>
        {children}
      </div>
    </div>
    );
  }
  