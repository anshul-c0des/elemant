import { UIComponentNode } from "@/types/ui";

export interface Version {
  id: string;
  tree: UIComponentNode;
  explanation?: string;
  timestamp: number;
}

interface VersionState {
  versions: Version[];
  currentVersionId: string | null;
}

export const versionStore = {
  versions: [] as {
    id: string;
    tree: UIComponentNode;
    explanation?: string | null;
    timestamp: number;
  }[],
  currentVersionId: null as string | null,
};

export function addVersion(
    tree: UIComponentNode,
    explanation?: string | null
  ) {
    const id = crypto.randomUUID();
  
    versionStore.versions.push({
      id,
      tree: structuredClone(tree),
      explanation,
      timestamp: Date.now(),
    });
  
    versionStore.currentVersionId = id;
  
    return id;
  }  

export function getCurrentTree(): UIComponentNode | null {
  const current = versionStore.versions.find(
    (v) => v.id === versionStore.currentVersionId
  );
  return current ? structuredClone(current.tree) : null;
}

export function rollback(versionId: string) {
  const exists = versionStore.versions.find((v) => v.id === versionId);
  if(!exists) {
    console.error("Available version IDs:", versionStore.versions.map(v => v.id));
    throw new Error("Version not found!")
  };
    
  versionStore.currentVersionId = versionId;
}
