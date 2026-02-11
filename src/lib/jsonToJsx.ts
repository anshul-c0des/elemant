import { UIComponentNode } from "@/types/ui";

export function jsonToJsx(node: UIComponentNode, indent = 0): string {
  const space = "  ".repeat(indent);

  const props =
    node.props && Object.keys(node.props).length > 0
      ? " " +
        Object.entries(node.props)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ")
      : "";

  if (!node.children || node.children.length === 0) {
    return `${space}<${node.type}${props} />`;
  }

  const children = node.children
    .map((child) => jsonToJsx(child, indent + 1))
    .join("\n");

  return `${space}<${node.type}${props}>
${children}
${space}</${node.type}>`;
}
