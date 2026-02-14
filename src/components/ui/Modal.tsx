import { ReactNode } from "react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose?: () => void;
  children?: ReactNode;
}

export default function Modal({
  title,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "8px",
          minWidth: "300px",
          maxWidth: "600px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <strong>{title}</strong>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✕
            </button>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
