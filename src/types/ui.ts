export type ComponentType =
  | "Navbar"
  | "Sidebar"
  | "Card"
  | "Button"
  | "Input"
  | "Table"
  | "Modal"
  | "Chart";

export interface UIComponentNode {
  id: string;
  type: ComponentType;
  props?: Record<string, any>;
  children?: UIComponentNode[];
}
