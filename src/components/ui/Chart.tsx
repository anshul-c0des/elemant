interface ChartProps {
    title?: string;
  }
  
  export default function Chart({ title = "Chart" }: ChartProps) {
    return (
      <div
        style={{
          padding: "16px",
          border: "1px solid #ddd",
          background: "#fafafa",
          marginTop: "12px",
        }}
      >
        <strong>{title}</strong>
        <div
          style={{
            height: "120px",
            background: "linear-gradient(to top, #000 40%, #ccc 40%)",
            marginTop: "8px",
          }}
        />
      </div>
    );
  }
  