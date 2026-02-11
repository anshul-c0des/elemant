interface ButtonProps {
    label?: string;
  }
  
  export default function Button({ label = "Button" }: ButtonProps) {
    return (
      <button
        style={{
          padding: "8px 16px",
          background: "#000",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    );
  }
  