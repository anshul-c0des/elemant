interface ChartProps {
  title: string;
}

export default function Chart({ title = "Chart" }: ChartProps) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        background: "#f5f5f5",
        borderRadius: "10px",
        marginTop: "12px",
      }}
    >
      <strong style={{ fontSize: "14px", color: "#333" }}>{title}</strong>

      <div
        style={{
          height: "120px",
          marginTop: "10px",
          borderRadius: "12px",
          background: "linear-gradient(to top, #999 30%, #ddd 30%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle curved bars */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "10%",
            width: "20%",
            height: "50%",
            borderRadius: "8px 8px 0 0",
            backgroundColor: "#bbb",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "40%",
            width: "20%",
            height: "70%",
            borderRadius: "8px 8px 0 0",
            backgroundColor: "#aaa",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "70%",
            width: "20%",
            height: "40%",
            borderRadius: "8px 8px 0 0",
            backgroundColor: "#ccc",
          }}
        />
      </div>
    </div>
  );
}
