import { ComponentType } from "@/types/ui";

type PropSchema = {
  required: string[];
  optional: string[];
};

export const ComponentPropSchema: Record<ComponentType, PropSchema> = {
  Page: { required: [], optional: [] },
  Main: { required: [], optional: [] },
  Section: { required: ["title"], optional: [] },

  Navbar: { required: ["title"], optional: [] },
  Sidebar: { required: ["title"], optional: [] },

  Card: { required: ["title"], optional: [] },

  Button: { required: ["title"], optional: ["variant"] },

  Input: { required: ["placeholder", "name"], optional: ["value", "type"] },

  Table: { required: [], optional: ["columns"] },

  Modal: { required: ["title", "isOpen"], optional: [] },

  Chart: { required: ["title"], optional: [] },
};
