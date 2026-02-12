import { UIComponentNode } from "@/types/ui";
import { AllowedComponents } from "./componentRegistry";

const MAX_DEPTH = 10;
const MAX_CHILDREN = 20;

export function validateTree(
  node: UIComponentNode,
  depth = 0
): void {
  if (depth > MAX_DEPTH) {
    throw new Error("Tree exceeds maximum depth");
  }

  if (!AllowedComponents.includes(node.type)) {
    throw new Error(`Invalid component type: ${node.type}`);
  }

  if (node.children && node.children.length > MAX_CHILDREN) {
    throw new Error("Too many children in node");
  }

  node.children?.forEach((child) =>
    validateTree(child, depth + 1)
  );
}
