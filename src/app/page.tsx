import JSONRenderer from "@/components/renderer/JSONRenderer";
import { UIComponentNode } from "@/types/ui";

const testTree: UIComponentNode = {
  id: "root",
  type: "Card",
  props: { title: "Dashboard" },
  children: [
    {
      id: "btn1",
      type: "Button",
      props: { label: "Click Me" },
    },
  ],
};


export default function HomePage() {
  return (
    <div className="app-container">
      <div className="panel left-panel">
        <h2>Chat</h2>
        <div className="placeholder">User input will appear here.</div>

        <h2>Explanation</h2>
        <div className="placeholder">AI explanation appears here.</div>
      </div>

      <div className="panel center-panel">
        <h2>Live Preview</h2>
        <div className="preview-container">
          <JSONRenderer node={testTree} />
        </div>
      </div>

      <div className="panel right-panel">
        <h2>Code</h2>
        <div className="code-container">
          JSX output will appear here.
        </div>

        <h2>Versions</h2>
        <div className="placeholder">Version history</div>
      </div>
    </div>
  );
}
