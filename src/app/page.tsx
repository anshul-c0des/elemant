"use client";

import { useEffect, useState } from "react";
import JSONRenderer from "@/components/renderer/JSONRenderer";
import { UIComponentNode } from "@/types/ui";
import { jsonToJsx, jsxToJson } from "@/lib/jsonJsxParser";
import { addVersion, versionStore } from "@/lib/versionStore";
import Editor from "@monaco-editor/react";

// const testAllComponentsTree: UIComponentNode = {   // mock components - local testing
//   id: "root",
//   type: "Card",
//   props: { title: "All Components Dashboard" },
//   children: [
//     {
//       id: "nav1",
//       type: "Navbar",
//       props: { title: "Main Navbar" },
//     },
//     {
//       id: "sidebar1",
//       type: "Sidebar",
//       props: { title: "Main Sidebar" },
//     },
//     {
//       id: "card1",
//       type: "Card",
//       props: { title: "Statistics Card" },
//       children: [
//         {
//           id: "btn1",
//           type: "Button",
//           props: { label: "Click Me" },
//         },
//         {
//           id: "input1",
//           type: "Input",
//           props: { placeholder: "Enter value" },
//         },
//       ],
//     },
//     {
//       id: "table1",
//       type: "Table",
//       props: { columns: ["Name", "Value"] },
//     },
//     {
//       id: "modal1",
//       type: "Modal",
//       props: { title: "Settings Modal" },
//     },
//     {
//       id: "chart1",
//       type: "Chart",
//       props: { title: "Sales Chart" },
//     },
//   ],
// };

export default function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [tree, setTree] = useState<UIComponentNode | null>(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [expLoading, setExpLoading] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [code, setCode] = useState(tree ? jsonToJsx(tree) : "");
  const [error, setError] = useState("");
  const [planSummary, setPlanSummary] = useState("");

useEffect(() => {
  if (tree) {
    setCode(jsonToJsx(tree));
  }
}, [tree]);
  
const handleApply = async () => {
  if (!code.trim()) return;

  try {
    const updatedTree = jsxToJson(code);

    setTree(updatedTree);

    const newVersionId = addVersion(updatedTree, "Manual Update" );
    setCurrentVersionId(newVersionId);
    setVersions([...versionStore.versions]);

    setError("");
  } catch (err: any) {
    console.error("Failed to apply code:", err);
    setError(err.message || "Invalid JSX code");
  }
};


  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    
    try {
      setLoading(true);
      
      // 1️⃣ Planner
      const planRes = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput, currentTree: tree }),
      });
      
      const plan = await planRes.json();
      
      // 2️⃣ Generator (also calls explainer)
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userInput }),
      });
      
      const data = await genRes.json();
      
      if (data.error) {
        setExplanation("Error: " + data.error);
        return;
      }
      
      if (data.tree) {
        setTree(data.tree);
        setExplanation(data.explanation || "");
        const summary = plan.summary || "";
        setPlanSummary(summary);

        // Create a new version automatically
        const newVersionId = addVersion(data.tree);
        setCurrentVersionId(newVersionId);

        setVersions([...versionStore.versions]);

        setExplanation(data.explanation || "");      
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = (versionId: string) => {
    const version = versionStore.versions.find(v => v.id === versionId);
    if (!version) {
      setExplanation("Cannot rollback: version not found.");
      return;
    }
    versionStore.currentVersionId = versionId;
    setTree(structuredClone(version.tree));
    setCurrentVersionId(versionId);
    setVersions([...versionStore.versions]);
    setExplanation(version.explanation || "");
  };
  
  const handleExplain = async () => {
    if (!tree) return;
  
    try {
      setExpLoading(true);
      const prevTree =
      currentVersionId
        ? versionStore.versions.find((v) => v.id === currentVersionId)?.tree
        : null;
  
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput, prevTree, currentTree: tree }),
      });
  
      const data = await res.json();
  
      if (data.error) {
        setExplanation("Error: " + data.error);
        return;
      }

      const newExplanation = data.explanation || "No explanation generated.";
      setExplanation(newExplanation);
  
      if (currentVersionId) {
      // update current version with explanation
      setVersions((prev) =>
        prev.map((v) =>
          v.id === currentVersionId ? { ...v, explanation: newExplanation } : v
        )
      );
  
      // Also update versionStore so rollback still works
      const versionIndex = versionStore.versions.findIndex(
        (v) => v.id === currentVersionId
      );
      if (versionIndex >= 0) {
        versionStore.versions[versionIndex].explanation = newExplanation;
      }
    }
    } catch (err) {
      console.error("Explain error:", err);
      setExplanation("Error generating explanation.");
    } finally {
      setExpLoading(false);
    }
  };
  
  const originalCode = tree ? jsonToJsx(tree) : "";
  const hasChanges = code !== originalCode;  

  return (
    <div className="app-container">
  
      {/* LEFT PANEL */}
      <div className="panel left-panel">
        <h2>Chat</h2>
  
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe the UI you want..."
          style={{ minWidth: "100%", height: "80px", marginTop: "8px", maxWidth: "100%" }}
        />
  
        <button
          onClick={handleSubmit}
          disabled={loading || !userInput.trim()}
          style={{ marginTop: "8px", padding: "9px 12px" }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
  
        {/* ERROR */}
        {error && (
          <div className="placeholder" style={{ marginTop: "16px", color: "red" }}>
            {error}
          </div>
        )}
  
        {/* Only show below sections if tree exists */}
        {tree && (
          <>
            {/* PLAN SUMMARY */}
            {planSummary && (
              <>
                <h2 style={{ marginTop: "24px" }}>Plan Summary</h2>
                <div className="plan-summary">{planSummary}</div>
              </>
            )}
  
            {/* EXPLANATION */}
            <h2 style={{ marginTop: "24px" }}>Explanation</h2>
            <button
              onClick={handleExplain}
              disabled={expLoading || !userInput.trim()}
              style={{ marginTop: "10px", padding: "9px 11px" }}
            >
              {expLoading ? "Processing..." : "Explain UI"}
            </button>
  
            {explanation && (
              <div className="placeholder">
                {explanation}
              </div>
            )}
          </>
        )}
      </div>
  
      {/* CENTER PANEL */}
      <div className="panel center-panel">
        <h2>Live Preview</h2>
  
        <div className="preview-container">
          <div className="preview-canvas">
            {tree ? <JSONRenderer node={tree} /> : <div>No UI generated yet.</div>}
          </div>
        </div>
      </div>
  
      {/* RIGHT PANEL */}
      <div className="panel right-panel">
  
        {/* Only show code editor if tree exists */}
        {tree && (
          <>
            <h2>Code Editor</h2>
            <div className="code-container">

            <Editor
              height="90%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                lineNumbers: "on",
                lineNumbersMinChars: 2, // smaller number gutter
                minimap: { enabled: false }, // remove minimap
                scrollBeyondLastLine: false,
                wordWrap: "on", // wrap by default
                wrappingIndent: "same",
                scrollbar: {
                  verticalScrollbarSize: 6,
                  horizontalScrollbarSize: 6,
                },
                hideCursorInOverviewRuler: true,
                lineDecorationsWidth: 0,
                padding: {
                  top: 10,
                  bottom: 10,
                },
              }}
            />

              <button
                style={{ marginTop: "8px", padding: "8px" }}
                onClick={handleApply}
                disabled={!tree || !hasChanges}
              >
                Apply Changes
              </button>
            </div>
          </>
        )}
  
        {/* Versions always visible */}
        <h2 style={{ marginTop: "24px" }}>Versions</h2>
        <div>
          {versions.length > 0 ? (
            [...versions]
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((v) => (
                <div
                  key={v.id}
                  onClick={() => handleRollback(v.id)}
                  className={`version-item ${v.id === currentVersionId ? "active" : ""}`}
                >
                  {new Date(v.timestamp).toLocaleTimeString()}
                </div>
              ))
          ) : (
            "No version history."
          )}
        </div>

      </div>
  
    </div>
  );
  
}
