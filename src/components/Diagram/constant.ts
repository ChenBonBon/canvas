import * as go from "gojs";
import { myDragComputation } from "./common";
import { NodeDesign } from "./design";

export namespace ToolName {
  export const CreateToolPrefix = "create_";
  export const CreateIfNode = CreateToolPrefix + NodeDesign.ifNode;
}

export const enum VirtualEdge {
  then = "then",
  else = "else",
  whenInner = "matchInner",
  whenOuter = "matchOuter",
}

export const enum VirtualNode {
  whenMatch = "match_vitural",
}

export namespace GraphColor {
  export const nodeFill = "#ddddff";
  export const nodeStroke = "#444488";

  export const portFill = "#6666cc";
  export const portStroke = "#444488";
  export const localVariableColor = "#FFD740";

  export const stateTopBarColor = "#FFF4E5";
}

export namespace GraphConfig {
  export const NODE_NAME = "node";

  export const LINKABLE_CURSOR = "pointer";

  export const SHAPE_STROKE = "Black";

  export const DASH_ARRAY = [3];

  export const portSize = new go.Size(7, 7);

  export const pinSize = new go.Size(6, 6);

  export const inoutSize = new go.Size(28, 28);

  export const groupMargin = new go.Margin(5);

  export const selectableConfig = {
    selectionObjectName: NODE_NAME,
  };

  export const resizableConfig = {
    resizable: true,
    resizeObjectName: NODE_NAME,
    selectionAdorned: false,
  };
  export const nodeConfig: Partial<go.Node> = {
    ...selectableConfig,
    ...resizableConfig,
    locationObjectName: NODE_NAME,
    dragComputation: myDragComputation,
  };
  export const selectableNodeConfig: Partial<go.Node> = {
    ...selectableConfig,
    locationObjectName: NODE_NAME,
    dragComputation: myDragComputation,
  };
  export const groupConfig: Partial<go.Group> = {
    ...resizableConfig,
    locationObjectName: NODE_NAME,
    dragComputation: myDragComputation,
  };
  export const portConfig: Partial<go.Panel> = {
    fromLinkable: true,
    toLinkable: true,
    cursor: "pointer",
  };
}
