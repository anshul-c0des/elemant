export type ComponentType =
  | "Navbar"
  | "Sidebar"
  | "Card"
  | "Button"
  | "Input"
  | "Table"
  | "Modal"
  | "Chart"
  | "Page"
  | "Main"
  | "Section"

export interface UIComponentNode {
  id: string;
  type: ComponentType;
  props?: Record<string, any>;
  children?: UIComponentNode[];
}
