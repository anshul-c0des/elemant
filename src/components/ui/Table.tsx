interface TableProps {
    columns?: string[];
  }
  
  export default function Table({
    columns = ["Column 1", "Column 2"],
  }: TableProps) {
    return (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "8px",
        }}
      >
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  background: "#f0f0f0",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns.map((_, i) => (
              <td
                key={i}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                Data
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  }
  