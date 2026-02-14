interface InputProps {
  placeholder: string;
  type?: "text" | "password";
  name: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function Input({
  placeholder = "",
  type = "text",
  value = "",
  onChange,
  name,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        width: "100%",
        padding: "8px",
        margin: "4px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px",
      }}
    />
  );
}
