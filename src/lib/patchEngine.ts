import { UIComponentNode } from "@/types/ui";
import { PlannerResponse } from "@/types/plan";

export function applyPlan(
  currentTree: UIComponentNode | null,
  plan: PlannerResponse
): UIComponentNode {
  if (plan.modificationType === "create") {
    return generateTreeFromCreate(plan.root);
  }

  if (!currentTree) {
    throw new Error("No existing tree to edit");
  }

  const updatedTree = structuredClone(currentTree);

  for (const action of plan.actions) {
    if (action.action === "addComponent" && action.targetId) {
      const target = findNode(updatedTree, action.targetId);
      if (target && action.component) {
        target.children = target.children || [];
        target.children.push({
          id: crypto.randomUUID(),
          type: action.component.type,
          props: action.component.props || {},
          children: [],
        });
      }
    }

    if (action.action === "removeComponent" && action.targetId) {
      removeNode(updatedTree, action.targetId);
    }

    if (
      action.action === "updateProp" &&
      action.targetId &&
      action.propKey
    ) {
      const target = findNode(updatedTree, action.targetId);
      if (target) {
        target.props = target.props || {};
        target.props[action.propKey] = action.propValue;
      }
    }
  }

  return updatedTree;
}

function generateTreeFromCreate(root: any): UIComponentNode {
  return {
    id: crypto.randomUUID(),
    type: root.type,
    props: root.props || {},
    children:
      root.children?.map((child: any) => generateTreeFromCreate(child)) || [],
  };
}

function findNode(
  node: UIComponentNode,
  id: string
): UIComponentNode | null {
  if (node.id === id) return node;

  for (const child of node.children || []) {
    const found = findNode(child, id);
    if (found) return found;
  }

  return null;
}

function removeNode(
  node: UIComponentNode,
  id: string
): boolean {
  if (!node.children) return false;

  const index = node.children.findIndex((child) => child.id === id);

  if (index !== -1) {
    node.children.splice(index, 1);
    return true;
  }

  for (const child of node.children) {
    const removed = removeNode(child, id);
    if (removed) return true;
  }

  return false;
}
