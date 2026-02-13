import { UIComponentNode } from "@/types/ui";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { AllowedComponents } from "./componentRegistry";

export function jsxToJson(code: string): UIComponentNode {
  // Parse JSX string into AST
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  let rootNode: UIComponentNode | null = null;

  // Recursive function to convert JSXElement AST node into UIComponentNode
  function jsxElementToNode(node: any): UIComponentNode {
    const type = node.openingElement.name.name;
    const props: Record<string, any> = {};

      if (!AllowedComponents.includes(type)) {
        throw new Error(`Invalid component type: ${type}`);
      }

    node.openingElement.attributes.forEach((attr: any) => {
      if (attr.type === "JSXAttribute") {
        const key = attr.name.name;
        let value = null;
        if (!attr.value) value = true;
        else if (attr.value.type === "StringLiteral") value = attr.value.value;
        else if (attr.value.type === "JSXExpressionContainer")
          value = attr.value.expression.value ?? null;
        props[key] = value;
      }
    });

    const children = (node.children || [])
      .filter((c: any) => c.type === "JSXElement")
      .map((c: any) => jsxElementToNode(c));

    return {
      id: crypto.randomUUID(),
      type,
      props,
      children,
    };
  }

  // Traverse the AST to find the first JSXElement
  traverse(ast, {
    JSXElement(path) {
      if (!rootNode) {
        rootNode = jsxElementToNode(path.node);
      }
    },
  });

  if (!rootNode) {
    throw new Error("No JSX element found in code");
  }

  return rootNode;
}

export function jsonToJsx(node: UIComponentNode, indent = 0): string {
  const space = "  ".repeat(indent);

  const props =
    node.props && Object.keys(node.props).length
      ? " " +
        Object.entries(node.props)
          .map(([k, v]) =>
            typeof v === "string" ? `${k}="${v}"` : `${k}={${JSON.stringify(v)}}`
          )
          .join(" ")
      : "";

  if (!node.children || node.children.length === 0) {
    return `${space}<${node.type}${props} />`;
  }

  const children = node.children
    .map((child) => jsonToJsx(child, indent + 1))
    .join("\n");

  return `${space}<${node.type}${props}>\n${children}\n${space}</${node.type}>`;
}
