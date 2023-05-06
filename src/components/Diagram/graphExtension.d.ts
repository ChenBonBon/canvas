import { GContainer, GEdge, GNode, IGraphObject, INode } from "./graph";

export interface IGoNode extends INode {
  group: string;
}

export interface GoNode extends GNode, IGoNode {
  items: IGraphObject[];
}

export interface GoEdge extends GEdge {
  from: string;
  to: string;
}

export interface GoContainer extends GContainer, IGoNode {
  isGroup: boolean;
  childNodes: IGoNode[];
}
