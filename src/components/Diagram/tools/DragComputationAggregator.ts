import { DraggingTool, Link, Part, Point, Rect, Spot } from "gojs";
import { NodeDesign } from "../design";
import { getActionOffest_Y } from "../template/GroupTemplate";

type IDragComputation = (
  thisPart: Part,
  newLoc: Point,
  snappedLoc: Point
) => Point;

export function stayInGroup(
  thisPart: Part,
  newLoc: Point,
  _snappedLoc: Point
): Point {
  // don't constrain top-level nodes
  const containingGroup = thisPart.containingGroup;
  if (containingGroup === null) return newLoc;
  // try to stay within the background Shape of the Group
  const back = containingGroup.resizeObject;
  if (back === null) return newLoc;

  // now limit the location appropriately
  const p1 = back.getDocumentPoint(Spot.TopLeft);
  const p2 = back.getDocumentPoint(Spot.BottomRight);
  const b = thisPart.actualBounds;
  const loc = thisPart.location;
  const parentData = thisPart.containingGroup?.data;
  if (parentData.descriptionId === "state") {
    return stayInStateGroup(newLoc, p1, p2, b, loc, parentData);
  }
  const x = Math.max(p1.x, Math.min(newLoc.x, p2.x - b.width)) + (loc.x - b.x);
  const y = Math.max(p1.y, Math.min(newLoc.y, p2.y - b.height)) + (loc.y - b.y);
  return new Point(x, y);
}

// 处理状态机子元素的拖动限制
export function stayInStateGroup(
  newLoc: Point,
  p1: Point,
  p2: Point,
  b: Rect,
  loc: Point,
  parentData: any
): Point {
  // 状态机 _final 为 false 时，子元素可移动范围 padding 设为 4
  // 状态机 _final 为 true 时，内部加一层细线边框，子元素可移动范围更小，padding 设为 8
  const padding = parentData.properties?._final ? 8 : 4;
  // 状态机有子元素时，存在一个高 20 的标题区域
  const titleHeight = 20;
  // 注意： label 在左侧时 labelWidth > 0，在右侧时为 0
  const labelWidth = loc.x - b.x;
  const x = Math.max(
    p1.x + padding + labelWidth,
    Math.min(newLoc.x, p2.x - padding - b.width + labelWidth)
  );
  const y =
    Math.max(
      p1.y + padding + titleHeight,
      Math.min(newLoc.y, p2.y - padding - b.height)
    ) +
    (loc.y - b.y);
  return new Point(x, y);
}

export const elseIntervalDistance = 20;
//每两条水平连接线的最小间距(其实还得加上控制点高度的一半)
export const linkIntervalDistance = 50 + elseIntervalDistance / 2;

export function avoidLinkedNodeOverlap(
  thisPart: Part,
  newLoc: Point,
  _snappedLoc: Point
): Point {
  let thisNode = thisPart.diagram?.findNodeForKey(thisPart.key);
  let it_node;
  if (
    thisNode?.category === NodeDesign.thenNode ||
    thisNode?.category === NodeDesign.whenMatch
  ) {
    //先考慮上方
    it_node = thisNode.findNodesInto();
    it_node.next();
    //当前Action所对应的控制点
    let controlNode = it_node.value;
    it_node = controlNode.findNodesInto();
    it_node.next();
    let preControlNode = it_node.value;
    //上一个点到该Action
    if (preControlNode) {
      newLoc.y = Math.max(
        newLoc.y,
        preControlNode.position.y -
          getActionOffest_Y(thisNode) +
          linkIntervalDistance
      );
    }
    //再考虑下方
    it_node = controlNode.findNodesOutOf();
    //nextControlNode为下一个控制点
    let nextControlNode;
    while (it_node.next()) {
      let node = it_node.value;
      if (node.category !== thisNode.category) nextControlNode = it_node.value;
    }
    if (nextControlNode) {
      //如果下方Action是elseAction的话 控制点即为action 特判
      if (nextControlNode.category === NodeDesign.elseNode) {
        newLoc.y = Math.min(
          newLoc.y,
          nextControlNode.position.y +
            getActionOffest_Y(nextControlNode) -
            getActionOffest_Y(thisNode) -
            linkIntervalDistance
        );
      }
      //下方的一般情况
      else {
        newLoc.y = Math.min(
          newLoc.y,
          nextControlNode.position.y +
            controlNode.actualBounds.height / 2 -
            getActionOffest_Y(thisNode) -
            linkIntervalDistance
        );
      }
    }
  }
  //如果是elseAction只要考慮上方即可
  if (thisNode?.category === NodeDesign.elseNode) {
    it_node = thisNode?.findNodesInto();
    it_node.next();
    let ifNode = it_node.value;
    newLoc.y = Math.max(
      newLoc.y,
      ifNode.position.y +
        ifNode.actualBounds.height / 2 -
        getActionOffest_Y(thisNode) +
        linkIntervalDistance
    );
  }
  return newLoc;
}

export function avoidNodeOverlap(node: any, _pt: Point, gridpt: Point): Point {
  // this assumes each node is fully rectangular
  const bnds = node.actualBounds;
  const loc = node.location;
  // use PT instead of GRIDPT if you want to ignore any grid snapping behavior
  // see if the area at the proposed location is unoccupied
  const r = new Rect(
    gridpt.x - (loc.x - bnds.x),
    gridpt.y - (loc.y - bnds.y),
    bnds.width,
    bnds.height
  );
  // maybe inflate R if you want some space between the node and any other nodes
  r.inflate(-0.5, -0.5); // by default, deflate to avoid edge overlaps with "exact" fits
  // when dragging a node from another Diagram, choose an unoccupied area
  if (
    !(node.diagram.currentTool instanceof DraggingTool) &&
    (!node._temp || !node.layer.isTemporary)
  ) {
    // in Temporary Layer during external drag-and-drop
    node._temp = true; // flag to avoid repeated searches during external drag-and-drop
    while (!isUnoccupied(r, node)) {
      r.x += 10; // note that this is an unimaginative search algorithm --
      r.y += 2; // you can improve the search here to be more appropriate for your app
    }
    r.inflate(0.5, 0.5); // restore to actual size
    // return the proposed new location point
    return new Point(r.x - (loc.x - bnds.x), r.y - (loc.y - bnds.y));
  }
  if (isUnoccupied(r, node)) return gridpt; // OK
  return loc; // give up -- don't allow the node to be moved to the new location
}

function isUnoccupied(r: any, node: any) {
  const diagram = node.diagram;

  // nested function used by Layer.findObjectsIn, below
  // only consider Parts, and ignore the given Node, any Links, and Group members
  function navigate(obj: any) {
    const part = obj.part;
    if (part === node) return null;
    if (part instanceof Link) return null;
    if (part.isMemberOf(node)) return null;
    if (node.isMemberOf(part)) return null;
    return part;
  }

  // only consider non-temporary Layers
  const lit = diagram.layers;
  while (lit.next()) {
    const lay = lit.value;
    if (lay.isTemporary) continue;
    if (lay.findObjectsIn(r, navigate, null, true).count > 0) return false;
  }
  return true;
}

/**
 * 限制移动逻辑组合器
 */
export class DragComputationAggregator {
  computations: IDragComputation[];

  constructor(...computations: IDragComputation[]) {
    this.computations = computations;
  }

  compute(thisPart: Part, newLoc: Point, snappedLoc: Point): Point {
    let x, y;
    let subtract = newLoc.copy().subtract(thisPart.location);
    const addX: boolean = subtract.x > 0;
    const addY: boolean = subtract.y > 0;

    let points = this.computations.map((computation) => {
      return computation(thisPart, newLoc, snappedLoc);
    });

    if (addX) {
      x = Math.min(newLoc.x, ...points.map((p) => p.x));
    } else {
      x = Math.max(newLoc.x, ...points.map((p) => p.x));
    }

    if (addY) {
      y = Math.min(newLoc.y, ...points.map((p) => p.y));
    } else {
      y = Math.max(newLoc.y, ...points.map((p) => p.y));
    }

    return new Point(x, y);
  }
}
