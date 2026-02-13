import { UIComponentNode } from "@/types/ui";
import { AllowedComponents } from "./componentRegistry";
import { ComponentPropSchema } from "./componentPropSchema";

const MAX_DEPTH = 6;
const MAX_CHILDREN = 15;

const FORBIDDEN_PATTERNS = ["<script", "javascript:", "onerror=", "eval(", "function("];

export function validateTree(
  node: UIComponentNode,
  depth = 0,
  seenIds = new Set<string>()
): void {
  if (depth > MAX_DEPTH) throw new Error("Tree exceeds maximum depth");
  if (!node || typeof node !== "object") throw new Error("Invalid node structure");
  if (typeof node.id !== "string") throw new Error("Node id must be a string");
  if (seenIds.has(node.id)) throw new Error(`Duplicate node id detected: ${node.id}`);
  seenIds.add(node.id);

  if (!AllowedComponents.includes(node.type)) throw new Error(`Invalid component type: ${node.type}`);
  if (!node.props || typeof node.props !== "object") throw new Error(`Invalid props for component: ${node.type}`);

  // Prop schema validation
  const schema = ComponentPropSchema[node.type];
  const keys = Object.keys(node.props);

  // Required props
  for (const prop of schema.required) {
    if (!(prop in node.props)) throw new Error(`Missing required prop "${prop}" in ${node.type}`);
  }

  // Unknown props
  for (const key of keys) {
    if (!schema.required.includes(key) && !schema.optional.includes(key)) {
      throw new Error(`Unknown prop "${key}" in component ${node.type}`);
    }

    const value = node.props[key];
    if (typeof value === "function") throw new Error(`Function values not allowed in props (${key})`);
    if (typeof value === "string") {
      const lower = value.toLowerCase();
      if (FORBIDDEN_PATTERNS.some(p => lower.includes(p))) {
        throw new Error(`Potentially unsafe value detected in prop "${key}"`);
      }
    }
  }

  // Children validation
  if (node.children) {
    if (!Array.isArray(node.children)) throw new Error("Children must be an array");
    if (node.children.length > MAX_CHILDREN) throw new Error("Too many children in node");

    for (const child of node.children) validateTree(child, depth + 1, seenIds);
  }
}
