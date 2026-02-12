"use client";

import { useState } from "react";
import JSONRenderer from "@/components/renderer/JSONRenderer";
import { UIComponentNode } from "@/types/ui";
import { jsonToJsx } from "@/lib/jsonToJsx";

export default function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [tree, setTree] = useState<UIComponentNode | null>(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    try {
      setLoading(true);

      // 1️⃣ Planner
      const planRes = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });

      const plan = await planRes.json();

      // 2️⃣ Generator (also calls explainer)
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userInput }),
      });

      const data = await genRes.json();

      if (data.tree) {
        setTree(data.tree);
        setExplanation(data.explanation || "");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const jsxCode = tree ? jsonToJsx(tree) : "";

  return (
    <div className="app-container">
      {/* LEFT PANEL */}
      <div className="panel left-panel">
        <h2>Chat</h2>

        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe the UI you want..."
          style={{ width: "100%", height: "80px", marginTop: "8px" }}
        />

        <button
          onClick={handleSubmit}
          style={{ marginTop: "8px", padding: "8px 12px" }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <h2 style={{ marginTop: "24px" }}>Explanation</h2>
        <div className="placeholder">
          {explanation || "AI explanation appears here."}
        </div>
      </div>

      {/* CENTER PANEL */}
      <div className="panel center-panel">
        <h2>Live Preview</h2>
        <div className="preview-container">
          {tree ? (
            <JSONRenderer node={tree} />
          ) : (
            <div>No UI generated yet.</div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="panel right-panel">
        <h2>Code</h2>
        <div className="code-container">
          <pre>{jsxCode}</pre>
        </div>

        <h2 style={{ marginTop: "24px" }}>Versions</h2>
        <div className="placeholder">
          Version history (coming next phase)
        </div>
      </div>
    </div>
  );
}
