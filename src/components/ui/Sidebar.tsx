interface SidebarProps {
    title?: string;
  }
  
  export default function Sidebar({ title = "Sidebar" }: SidebarProps) {
    return (
      <div
        style={{
          width: "200px",
          padding: "16px",
          background: "#f4f4f4",
          borderRight: "1px solid #ddd",
        }}
      >
        <strong>{title}</strong>
      </div>
    );
  }
  