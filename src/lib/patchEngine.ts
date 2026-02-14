import { UIComponentNode } from "@/types/ui";
import { PlannerResponse } from "@/types/plan";

const LAYOUT_COMPONENTS = ["Page", "Main", "Section", "Sidebar", "Navbar"];   // layout components to prevent blank edits

export function applyPlan(
  currentTree: UIComponentNode | null,
  plan: PlannerResponse
): UIComponentNode {
  if (plan.modificationType === "create") {   // creates a new tree if user generates a new idea
    return generateTreeFromCreate(plan.root);
  }

  if (!currentTree) {
    throw new Error("No existing tree to edit");
  }

  if (plan.modificationType === "edit") {   // edits the current tree
    const updatedTree = structuredClone(currentTree);
    let appliedAny = false;

    for (const action of plan.actions) {
      switch (action.action) {
        case "addComponent":   // to add new component
          if (action.targetId && action.component) {
            const target = findNode(updatedTree, action.targetId);
            if (target) {
              target.children = target.children || [];
              target.children.push({
                id: crypto.randomUUID(),
                type: action.component.type,
                props: action.component.props || {},
                children: [],
              });
              appliedAny = true;
            }
          }
          break;

        case "removeComponent":   // removes a component
          if (action.targetId) {
            const removed = removeNode(updatedTree, action.targetId);
            if (removed) appliedAny = true;
          }
          break;

        case "updateProp":   // update props of a component
          if (action.targetId && action.propKey) {
            const target = findNode(updatedTree, action.targetId);
            if (target) {
              target.props = target.props || {};
              target.props[action.propKey] = action.propValue;
              appliedAny = true;
            }
          }
          break;
      }
    }

    if (!appliedAny) {
      throw new Error("No matching components found for the requested updates");
    }

    return updatedTree;
  }

  throw new Error("Unsupported modification type");
}

function generateTreeFromCreate(root: any): UIComponentNode {   // creates a new tree
  return {
    id: crypto.randomUUID(),
    type: root.type,
    props: root.props || {},
    children:
      root.children?.map((child: any) => generateTreeFromCreate(child)) || [],
  };
}

function findNode(node: UIComponentNode, id: string): UIComponentNode | null {   // finds the node in the tree
  if (node.id === id) return node;

  for (const child of node.children || []) {
    const found = findNode(child, id);
    if (found) return found;
  }

  return null;
}

function removeNode(node: UIComponentNode, id: string): boolean {   // removes a node in the tree
  if (!node.children) return false;

  const index = node.children.findIndex((child) => child.id === id);

  if (index !== -1) {
    if (LAYOUT_COMPONENTS.includes(node.children[index].type)) {   // do not remove layout components
      return false;
    }
    node.children.splice(index, 1);
    return true;
  }
  for (const child of node.children) {
    const removed = removeNode(child, id);
    if (removed) return true;
  }

  return false;
}
