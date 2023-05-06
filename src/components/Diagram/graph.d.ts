/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.36.1070 on 2022-10-12 15:18:29.

export interface GDiagram {
  id: string;
  kind: string;
  targetObjectId: string;
  descriptionId: string;
  label: string;
  position: GPosition;
  size: GSize;
  nodes: INode[];
  edges: GEdge[];
}

export interface GNode extends GAbstractNode<GNode> {
  kind: "Node";
  size: GSize;
  shapes: GShape[];
  labels: GLabel[];
  borderNodes: GPort[];
  loc: GPosition;
}

export interface GContainer extends GAbstractNode<GContainer> {
  kind: "Container";
  size: GSize;
  childNodes: INode[];
  edges: GEdge[];
  loc: GPosition;
}

export interface GPort extends GAbstractNode<GPort> {
  kind: "Port";
  align: GPosition;
}

export interface GShape extends GAbstractGraphObject<GShape> {
  kind: "Shape";
  align: GPosition;
  color: string;
  figure: string;
  scale: GSize;
  angle?: number;
}

export interface GLabel extends GAbstractGraphObject<GLabel> {
  kind: "Label";
  parentId: string;
  targetObjectId: string;
  text: string;
  align: GPosition;
  font: string;
  editable: boolean;
  color: string;
}

export interface GEdge extends IGraphObject {
  kind: "Edge";
  targetObjectId: string;
  targetObjectKind: string;
  targetObjectLabel: string;
  labels: GLabel[];
  sourceId: string;
  targetId: string;
  style: GIEdgeStyle;
  routingPoints: GPosition[];
  sourceAnchor: GPosition;
  targetAnchor: GPosition;
}

export interface GPosition {
  x: number;
  y: number;
}

export interface GSize {
  width: number;
  height: number;
}

export interface INode extends IGraphObject {
  kind: "Node" | "Container" | "Port";
  targetObjectId: string;
  targetObjectKind: string;
  targetObjectLabel: string;
}

export interface GIEdgeStyle {
  id: string;
}

export interface IGraphObject {
  kind: "Edge" | "Node" | "Container" | "Port" | "Shape" | "Label";
  id: string;
  type: string;
  descriptionId: string;
}

export interface GAbstractNode<T>
  extends GAbstractGraphObject<GAbstractNode<T>>,
    INode {
  kind: "Node" | "Container" | "Port";
  properties: { [index: string]: any };
}

export interface GAbstractGraphObject<T> extends IGraphObject {
  kind: "Shape" | "Label" | "Node" | "Container" | "Port";
}
