interface ButtonProps {
  title: string;
  variant?: "primary" | "secondary";
}

export default function Button({ title, variant = "primary" }: ButtonProps) {
  const bgColor = variant === "primary" ? "#000" : "#6c757d";
  const textColor = "#fff";
  return (
    <button
      style={{
        padding: "8px 16px",
        margin: "4px 0",
        backgroundColor: bgColor,
        color: textColor,
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: 500,
      }}
    >
      {title}
    </button>
  );
}
