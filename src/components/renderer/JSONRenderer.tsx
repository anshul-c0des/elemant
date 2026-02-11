import { UIComponentNode } from "@/types/ui";
import { ComponentRegistry } from "@/lib/componentRegistry";

interface Props {
  node: UIComponentNode;
}

export default function JSONRenderer({ node }: Props) {
  const Component =
    ComponentRegistry[node.type as keyof typeof ComponentRegistry];

  if (!Component) {
    return <div>Invalid component: {node.type}</div>;
  }

  const children =
    node.children?.map((child) => (
      <JSONRenderer key={child.id} node={child} />
    )) || null;

  return <Component {...(node.props || {})}>{children}</Component>;
}
