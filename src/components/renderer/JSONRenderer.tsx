import { UIComponentNode } from "@/types/ui";
import { ComponentRegistry } from "@/lib/componentRegistry";
import { ComponentPropSchema } from "@/lib/componentPropSchema";

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

  const schema = ComponentPropSchema[node.type];
  const propsWithDefaults: Record<string, any> = { ...node.props };

  if (schema) {
    for (const req of schema.required) {
      if (!(req in propsWithDefaults)) {
        propsWithDefaults[req] = getDefaultForProp(req);
      }
    }
  }

  return <Component {...(propsWithDefaults as any)}>{children}</Component>;
}

function getDefaultForProp(prop: string) {
  if (prop === "title" || prop === "placeholder" || prop === "name") return "";
  if (prop === "isOpen") return false;
  if (prop === "variant") return "primary";
  return null;
}
