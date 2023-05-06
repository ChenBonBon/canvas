import { Link, Node, Panel, Part, Point, Rect, Spot } from "gojs";
import { ToolName } from "./constant";
import { NodeDesign } from "./design";
import { INode } from "./graph";
import { canCreateEdge } from "./toolServices";
import {
  DragComputationAggregator,
  avoidLinkedNodeOverlap,
  avoidNodeOverlap,
  stayInGroup,
} from "./tools/DragComputationAggregator";

export const doHighlight = (diagram: any, node: any) => {
  const oldSkips = diagram.skipsUndoManager;
  diagram.skipsUndoManager = true;
  diagram.startTransaction("highlight");
  if (node !== null) {
    diagram.highlight(node);
  } else {
    diagram.clearHighlighteds();
  }
  diagram.commitTransaction("highlight");
  diagram.skipsUndoManager = oldSkips;
};

export const linkValidation = (diagramServer: any) => {
  return function (
    fromNode: Node,
    fromPort: Panel,
    toNode: Node,
    toPort: Panel,
    link: Link
  ): boolean {
    if (
      (fromNode.category === NodeDesign.state ||
        fromNode.category === NodeDesign.fork) &&
      toNode.category === NodeDesign.state
    ) {
      return true;
    }
    if (!fromPort.data || !toPort.data) {
      return false;
    }
    return canCreateEdge(
      diagramServer.edgeCandidates,
      fromPort.data,
      toPort.data
    );
  };
};

/**
 * 计算当前对象的平均分布点
 */
export const evenPoint: (item: any, arrays: any) => number = (item, arrays) => {
  let value = (arrays.indexOf(item) + 1) / (arrays.length + 1);
  return parseFloat(value.toFixed(3));
};

export const reverseSpot: (spot: Spot) => Spot = (spot: Spot) => {
  return new Spot(1 - spot.x, 1 - spot.y);
};

export const isGroup = (node: INode) => {
  return node.kind === "Container";
};

let CreateNeedTargetID = [
  NodeDesign.ifNode,
  NodeDesign.whenMatch,
  NodeDesign.state,
];

export const isCreateNeedTargetID = (toolName: any) => {
  let NodeName = toolName.split(ToolName.CreateToolPrefix)[1];
  return CreateNeedTargetID.includes(NodeName);
};

export const getRealID = (id: string) => {
  //虚拟对象的id都是 = 其依赖对象id+后缀 构成
  //所以取其前36位作为真实id
  let RealIdLength = 36;
  return id.substring(0, RealIdLength);
};

/**
 * 求点到矩形的最短距离
 */
export const shortestDistance: (point: Point, rect: Rect) => number = (
  point: Point,
  rect: Rect
) => {
  //rect相对坐标
  point = point.copy().subtract(rect.position);
  return Math.min(
    Math.abs(point.x), //left
    Math.abs(rect.width - point.x), //right
    Math.abs(point.y), //top
    Math.abs(rect.height - point.y) //bottom
  );
};

export function myDragComputation(
  thisPart: Part,
  newLoc: Point,
  snappedLoc: Point
): Point {
  return new DragComputationAggregator(
    stayInGroup,
    avoidNodeOverlap,
    avoidLinkedNodeOverlap
  ).compute(thisPart, newLoc, snappedLoc);
}
