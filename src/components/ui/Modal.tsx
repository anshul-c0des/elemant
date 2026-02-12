interface ModalProps {
    title?: string;
  }
  
  export default function Modal({ title = "Modal Title" }: ModalProps) {
    return (
      <div
        style={{
          padding: "16px",
          border: "1px solid #000",
          background: "#fff",
          marginTop: "12px",
        }}
      >
        <strong>{title}</strong>
        <div style={{ marginTop: "8px" }}>
          Modal content goes here.
        </div>
      </div>
    );
  }
  