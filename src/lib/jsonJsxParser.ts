import { UIComponentNode } from "@/types/ui";
import { parse } from "@babel/parser";
import { AllowedComponents } from "./componentRegistry";

export function jsxToJson(code: string): UIComponentNode {   // converts user written jsx to json
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const body = ast.program.body;

  if (body.length !== 1 || body[0].type !== "ExpressionStatement") {   // blank check
    throw new Error("Code must contain a single root JSX element");
  }

  const expression = body[0].expression;

  if (expression.type !== "JSXElement") {   // jsx element check
    throw new Error("Root must be a JSX element");
  }

  function jsxElementToNode(node: any): UIComponentNode {
    const type = node.openingElement.name.name;

    if (!AllowedComponents.includes(type)) {   // checks whether user entered element is allowed
      throw new Error(`Invalid component type: ${type}`);
    }

    const props: Record<string, unknown> = {};

    for (const attr of node.openingElement.attributes) {
      if (attr.type === "JSXSpreadAttribute") {
        throw new Error("Spread attributes are not allowed");
      }

      if (attr.type !== "JSXAttribute") continue;

      const key = attr.name.name;

      if (!attr.value) {
        props[key] = true;
        continue;
      }

      if (attr.value.type === "StringLiteral") {
        props[key] = attr.value.value;
        continue;
      }

      if (attr.value.type === "JSXExpressionContainer") {
        const expr = attr.value.expression;

        if (
          expr.type === "StringLiteral" ||
          expr.type === "NumericLiteral" ||
          expr.type === "BooleanLiteral"
        ) {
          props[key] = expr.value;
          continue;
        }
        if (expr.type === "ArrayExpression") {   // array for table columns
          props[key] = expr.elements.map((el: any) => {
            if (
              el.type === "StringLiteral" ||
              el.type === "NumericLiteral" ||
              el.type === "BooleanLiteral"
            ) {
              return el.value;
            }
            throw new Error(
              `Only literal values allowed in array prop "${key}"`
            );
          });
          continue;
        }
      }

      throw new Error(`Invalid value for prop "${key}"`);
    }

    const children = node.children
      .filter((c: any) => c.type === "JSXElement")
      .map((c: any) => jsxElementToNode(c));

    return {
      id: crypto.randomUUID(),
      type,
      props,
      children,
    };
  }

  return jsxElementToNode(expression);
}

export function jsonToJsx(node: UIComponentNode, indent = 0): string {   // json to jsx converter for live preview
  const space = "  ".repeat(indent);

  const props =
    node.props && Object.keys(node.props).length
      ? " " +
        Object.entries(node.props)
          .map(([k, v]) =>
            typeof v === "string"
              ? `${k}="${v}"`
              : `${k}={${JSON.stringify(v)}}`
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
