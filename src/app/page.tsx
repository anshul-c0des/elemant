"use client";

import { useState } from "react";
import JSONRenderer from "@/components/renderer/JSONRenderer";
import { UIComponentNode } from "@/types/ui";
import { jsonToJsx } from "@/lib/jsonToJsx";


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

// import { applyPlan } from "@/lib/patchEngine";   // mock data - incremental patching
//   const testAllComponentsTree: UIComponentNode = {
//     id: "root",
//     type: "Card",
//     props: { title: "Dashboard" },
//     children: [
//       { id: "btn1", type: "Button", props: { label: "Click Me" } },
//       { id: "input1", type: "Input", props: { placeholder: "Type here" } },
//     ],
//   };
//   const addPlan = {
//     modificationType: "edit",
//     actions: [
//       {
//         action: "addComponent",
//         targetId: "root", // parent where to add
//         component: { type: "Button", props: { label: "New Button" } },
//       },
//     ],
//   };
//   const removePlan = {
//     modificationType: "edit" as const,
//     actions: [
//       { action: "removeComponent", targetId: "btn1" },
//     ],
//   };
//   const updatePlan = {
//     modificationType: "edit" as const,
//     actions: [
//       { action: "updateProp", targetId: "input1", propKey: "placeholder", propValue: "Updated Text" },
//     ],
//   };


export default function HomePage() {
  const [userInput, setUserInput] = useState("");
  const [tree, setTree] = useState<UIComponentNode | null>(null);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);

//   let updatedTree = applyPlan(testAllComponentsTree, addPlan);   // test incremental patching
// console.log("After Add:", updatedTree);

// updatedTree = applyPlan(updatedTree, removePlan);
// console.log("After Remove:", updatedTree);

// updatedTree = applyPlan(updatedTree, updatePlan);
// console.log("After Update:", updatedTree);
  
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
      }
      const versionsRes = await fetch("/api/versions");
      const versionsData = await versionsRes.json();
      
      setVersions(versionsData.versions);
      setCurrentVersionId(versionsData.currentVersionId);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (versionId: string) => {
    const res = await fetch("/api/rollback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ versionId }),
    });
  
    const data = await res.json();
  
    if (data.tree) {
      setTree(data.tree);
      setCurrentVersionId(versionId);
  
      const versionsRes = await fetch("/api/versions");
      const versionsData = await versionsRes.json();
  
      const selected = versionsData.versions.find(
        (v: any) => v.id === versionId
      );
  
      setExplanation(selected?.explanation || "");
    }
  };
  
  const handleExplain = async () => {
    if (!tree) return;
  
    try {
      setLoading(true);
  
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });
  
      const data = await res.json();
  
      if (data.error) {
        setExplanation("Error: " + data.error);
      } else {
        setExplanation(data.explanation || "No explanation generated.");
      }
  
      const versionsRes = await fetch("/api/versions");
      const versionsData = await versionsRes.json();
      setVersions(versionsData.versions);
      setCurrentVersionId(versionsData.currentVersionId);
  
    } catch (err) {
      console.error("Explain error:", err);
      setExplanation("Error generating explanation.");
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
          onClick={handleSubmit} disabled={loading}
          style={{ marginTop: "8px", padding: "8px 12px" }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <h2 style={{ marginTop: "24px" }}>Explanation</h2>
        <button onClick={handleExplain} disabled={!tree || loading} style={{ marginTop: "10px", padding:"4px" }}>{loading ? "Processing..." : "Explain UI"}</button>
        {explanation && 
        <div className="placeholder">
          {explanation}
        </div>
        }
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
          {tree ? 
          <pre>{jsxCode}</pre>
          : "No code generated yet."
          }
        </div>

        <h2 style={{ marginTop: "24px" }}>Versions</h2>
        <div>
          {versions.length>0 ? 
            versions.map((v) => (
              <div
                key={v.id}
                onClick={() => handleRollback(v.id)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  background:
                    v.id === currentVersionId ? "#ddd" : "#f5f5f5",
                  marginBottom: "4px",
                }}
              >
                {new Date(v.timestamp).toLocaleTimeString()}
              </div>
            ))
            :
            "No version history yet."
          }
        </div>
      </div>
    </div>
  );
}
