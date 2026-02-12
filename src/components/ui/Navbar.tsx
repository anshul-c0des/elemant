interface NavbarProps {
    title?: string;
  }
  
  export default function Navbar({ title = "Navbar" }: NavbarProps) {
    return (
      <div
        style={{
          padding: "12px 16px",
          background: "#111",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        {title}
      </div>
    );
  }
  