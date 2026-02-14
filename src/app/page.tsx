"use client";

import { useEffect, useState } from "react";
import JSONRenderer from "@/components/renderer/JSONRenderer";
import { UIComponentNode } from "@/types/ui";
import { jsonToJsx, jsxToJson } from "@/lib/jsonJsxParser";
import { addVersion, versionStore } from "@/lib/versionStore";
import Editor from "@monaco-editor/react";

export default function HomePage() {
  const [userInput, setUserInput] = useState("");   // user's idea to generate
  const [tree, setTree] = useState<UIComponentNode | null>(null);   // tree form planner/generator
  const [explanation, setExplanation] = useState("");   // seperate explanations
  const [loading, setLoading] = useState(false);   // loading state
  const [expLoading, setExpLoading] = useState(false);   // seperate explanation loading state
  const [versions, setVersions] = useState<any[]>([]);   // version history
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);   // toggle versions
  const [code, setCode] = useState(tree ? jsonToJsx(tree) : "");   // code in editor
  const [error, setError] = useState("");   // error state
  const [planSummary, setPlanSummary] = useState("");   // plan summary oputput form AI

  useEffect(() => {   // set code from tree
    if (tree) {
      setCode(jsonToJsx(tree));
    }
  }, [tree]);

  const handleApply = async () => {   // handle manual updates
    if (!code.trim()) return;

    try {
      const updatedTree = jsxToJson(code);   // converst jsx code to JSON

      setTree(updatedTree);

      const newVersionId = addVersion(updatedTree, "Manual Update");   // creates a new version
      setCurrentVersionId(newVersionId);   // set current version
      setVersions([...versionStore.versions]);   // store version

      setError("");
    } catch (err: any) {
      console.error("Failed to apply code:", err);
      setError(err.message || "Invalid JSX code");
    }
  };

  const handleSubmit = async () => {   // handle idea generation from user prompt
    if (!userInput.trim()) return;

    try {
      setLoading(true);

      // 1. Planner
      const planRes = await fetch("/api/plan", {   // plans the idea
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput, currentTree: tree }),
      });

      const plan = await planRes.json();

      // 2. Generator
      const genRes = await fetch("/api/generate", {   // generates the tree - patch engine
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userInput }),
      });

      const data = await genRes.json();

      if (data.error) {
        setError("Error: " + data.error);
        return;
      }

      if (data.tree) {
        setTree(data.tree);
        const summary = plan.summary || "";
        setPlanSummary(summary);

        // Create a new version
        const newVersionId = addVersion(data.tree);
        setCurrentVersionId(newVersionId);

        setVersions([...versionStore.versions]);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error: " + error)
    } finally {
      setLoading(false);
      setError("")
    }
  };

  const handleRollback = (versionId: string) => {   // toggles version
    const version = versionStore.versions.find((v) => v.id === versionId);
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

  const handleExplain = async () => {   // explains the ui or changes
    if (!tree) return;

    try {
      setExpLoading(true);

      let prevTree: UIComponentNode | null = null;

      if (currentVersionId) {   // checks whether prev tree exists for comparison
        const currentIndex = versionStore.versions.findIndex(
          (v) => v.id === currentVersionId
        );
        if (currentIndex > 0) {
          prevTree = structuredClone(
            versionStore.versions[currentIndex - 1].tree
          );
        }
      }

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
        setVersions((prev) =>
          prev.map((v) =>
            v.id === currentVersionId
              ? { ...v, explanation: newExplanation }
              : v
          )
        );

        // Update versionStore so rollback still works
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

  const originalCode = tree ? jsonToJsx(tree) : "";   // tracks manual changes in code
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
          style={{
            minWidth: "100%",
            height: "80px",
            marginTop: "8px",
            maxWidth: "100%",
          }}
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
          <div
            className="placeholder"
            style={{ marginTop: "16px", color: "red" }}
          >
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
            {
              <button
                onClick={handleExplain}
                disabled={expLoading}
                style={{ marginTop: "10px", padding: "9px 11px" }}
              >
                {expLoading ? "Processing..." : "Explain UI"}
              </button>
            }

            {explanation && <div className="placeholder">{explanation}</div>}
          </>
        )}
      </div>

      {/* CENTER PANEL */}
      <div className="panel center-panel">
        <h2>Live Preview</h2>

        <div className="preview-container">
          <div className="preview-canvas">
            {tree ? (
              <JSONRenderer node={tree} />
            ) : loading ? (
              <div>Generating UI...</div>
            ) : (
              <div>No UI generated yet.</div>
            )}
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
          {versions.length > 0
            ? [...versions]
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((v) => (
                  <div
                    key={v.id}
                    onClick={() => handleRollback(v.id)}
                    className={`version-item ${
                      v.id === currentVersionId ? "active" : ""
                    }`}
                  >
                    {new Date(v.timestamp).toLocaleTimeString()}
                  </div>
                ))
            : "No version history."}
        </div>
      </div>
    </div>
  );
}
