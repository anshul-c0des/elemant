export type ModificationType = "create" | "edit";

export interface CreatePlan {
  modificationType: "create";
  root: {
    type: string;
    props?: Record<string, any>;
    children?: any[];
  };
}

export interface EditAction {
  action: "addComponent" | "removeComponent" | "updateProp";
  targetId?: string;
  component?: {
    type: string;
    props?: Record<string, any>;
  };
  propKey?: string;
  propValue?: any;
}

export interface EditPlan {
  modificationType: "edit";
  actions: EditAction[];
}

export type PlannerResponse = CreatePlan | EditPlan;
