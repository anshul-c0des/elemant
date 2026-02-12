"use client";

import { useState } from "react";
import JSONRenderer from "@/components/renderer/JSONRenderer";
import { UIComponentNode } from "@/types/ui";
import { applyPlan } from "@/lib/patchEngine";
import { addVersion, rollback, getCurrentTree, versionStore } from "@/lib/versionStore";

export default function ManualPatchPage() {
    const [tree, setTree] = useState<UIComponentNode | null>(() => {
        if (getCurrentTree()) return getCurrentTree(); // reuse existing tree
        const initialTree: UIComponentNode = {
          id: crypto.randomUUID(),
          type: "Card",
          props: { title: "Manual Dashboard" },
          children: [],
        };
        addVersion(initialTree, "Initial Manual Dashboard");
        return initialTree;
      });
      

  const [versionsList, setVersionsList] = useState(versionStore.versions);

  const handleAddButton = () => {
    if (!tree) return;

    const plan = {
      modificationType: "edit",
      actions: [
        {
          action: "addComponent",
          targetId: tree.id,
          component: { type: "Button", props: { label: "Click Me" } },
        },
      ],
    };

    const updatedTree = applyPlan(getCurrentTree(), plan);
    addVersion(updatedTree, "Added Button");
    setTree(updatedTree);    
    setVersionsList([...versionStore.versions]);
  };

  const handleRemoveButton = () => {
    if (!tree || tree.children.length === 0) return;

    const buttonId = tree.children[0].id;
    const plan = {
      modificationType: "edit",
      actions: [
        {
          action: "removeComponent",
          targetId: buttonId,
        },
      ],
    };

    const updatedTree = applyPlan(getCurrentTree(), plan);
    addVersion(updatedTree, "Removed Button");
    setTree(updatedTree);
    setVersionsList([...versionStore.versions]);
  };

  const handleRollback = (versionId: string) => {
    rollback(versionId);
    setTree(getCurrentTree());
    setVersionsList([...versionStore.versions]);
  };

  return (
    <div style={{ display: "flex", gap: "24px", padding: "16px" }}>
      <div style={{ flex: 1 }}>
        <h2>Manual Patching</h2>
        <button onClick={handleAddButton} style={{ marginRight: 8 }}>Add Button</button>
        <button onClick={handleRemoveButton}>Remove Button</button>

        <h3 style={{ marginTop: 16 }}>Versions</h3>
        <ul>
          {versionsList.map((v) => (
            <li key={v.id}>
              <button onClick={() => handleRollback(v.id)}>
                {v.id} - {v.explanation || "No explanation"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 2 }}>
        <h2>Tree Preview</h2>
        {tree ? <JSONRenderer node={tree} /> : <div>No tree</div>}
      </div>
    </div>
  );
}
