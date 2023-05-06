import {
  Binding,
  GraphObject,
  Group,
  Node,
  Panel,
  Part,
  Point,
  Shape,
  Size,
  Spot,
  TextBlock,
} from "gojs";
import { myDragComputation } from "../common";
import { GraphConfig, VirtualNode } from "../constant";
import { NodeDesign } from "../design";
import {
  portIdBinding,
  positionBinding,
  sizeBinding,
  stateFinalIconPositionBinding,
  stateFinalPanelDesiredSizeBinding,
  stateFinalPanelMarginBinding,
  stateFinalPanelStrokeBinding,
  stateFinalPanelStrokeWidthBinding,
  stateFinalTitleBorderBinding,
  stateFinalTitleBorderLengthBinding,
  stateFinalTitleBorderVisibleBinding,
  stateFinalTitleDesiredSizeBinding,
  stateFinalTitleMarginBinding,
  stateFinalTitleStrokeWidthBinding,
  stateInitialBinding,
  stateMachineFillBinding,
  stateTitleFillWidthBinding,
} from "./Bindings";

export namespace GroupTemplate {
  function getThisControlNode(part: Part): Node {
    let thisNode = part.diagram?.findNodeForKey(part.key);
    if (
      thisNode?.category === NodeDesign.ifNode ||
      thisNode?.category === VirtualNode.whenMatch
    ) {
      return thisNode;
    }
    let it_node = thisNode!.findNodesConnected();
    it_node.next();
    //找到与当前group所连得group
    return it_node.value;
  }

  export function groupDragComputation(
    thisPart: Part,
    newLoc: Point,
    snappedLoc: Point
  ) {
    let target = newLoc;
    let controlNode = getThisControlNode(thisPart);
    const computeX =
      controlNode.position.x +
      controlNode.actualBounds.width +
      intervalDistance;
    if (computeX > target.x) {
      target.x = computeX;
    }
    target = myDragComputation(thisPart, newLoc, snappedLoc);
    if (
      thisPart.diagram?.findNodeForKey(thisPart.key)?.category !==
      NodeDesign.elseNode
    )
      controlNode.moveTo(
        controlNode.position.x,
        target.y -
          controlNode.actualBounds.height / 2 +
          getActionOffest_Y(thisPart)
      );
    return target;
  }

  export const ActionGroupToSpot = new Spot(0, 0.2);
  export const intervalDistance = 50;

  const ActionGroup = () =>
    new Group({
      ...GraphConfig.groupConfig,
      dragComputation: groupDragComputation,
      toSpot: ActionGroupToSpot,
    })
      .bind(positionBinding())
      .bind(
        new Binding("background", "isHighlighted", (h) =>
          h ? "rgba(255,0,0,0.5)" : "transparent"
        ).ofObject()
      )
      .add(
        new Shape("Rectangle", {
          name: GraphConfig.NODE_NAME,
          fill: "transparent",
          strokeWidth: 2,
        }).bind(sizeBinding().makeTwoWay())
      );

  export const ThenGroup = () => ActionGroup();
  export const ElseGroup = () => ActionGroup();
  export const WhenMatchGroup = () => ActionGroup();

  export const BlockGroup = () =>
    new Group("Auto", GraphConfig.groupConfig).bind(positionBinding()).add(
      new Panel("Spot")
        .add(
          new Shape("VirtualGroup", {
            name: GraphConfig.NODE_NAME,
            fill: "transparent",
            strokeDashArray: GraphConfig.DASH_ARRAY, // state machine 会用到这个
          })
            .bind(sizeBinding().makeTwoWay())
            .bind(
              new Binding("fill", "isHighlighted", (h, shape) => {
                if (h) return "#aaea9a";
                return "transparent";
              }).ofObject()
            )
        )
        .add(
          new TextBlock({
            editable: true,
            stroke: "Black",
            background: "#FFFFFF",
            alignment: new Spot(1, 0, -30, 1),
            alignmentFocus: new Spot(1, 0.5),
          }).bind("text", "targetObjectLabel")
        )
    );

  export const IfBlockGroup = () => BlockGroup();
  export const WhenBlockGroup = () => BlockGroup();
  export const stateMachine = () => BlockGroup();

  // 状态机标题部分
  const stateTitle = () =>
    new Panel("Spot")
      .add(
        // state 头部色块
        new Shape("RoundedTopRectangle", {
          stroke: "transparent",
        })
          .bind(stateFinalTitleStrokeWidthBinding())
          .bind(stateFinalTitleDesiredSizeBinding())
          .bind(stateTitleFillWidthBinding())
          .bind(stateFinalTitleMarginBinding())
      )
      // state 头部色块里的文字
      .add(
        new TextBlock({
          textAlign: "center",
          editable: true,
          alignment: new Spot(0.5, 0.5),
        }).bind("text", "targetObjectLabel")
      );

  const stateContentPanel = () =>
    new Panel("Position", {
      alignment: Spot.TopLeft,
      alignmentFocus: Spot.TopLeft,
    })
      .add(
        new Shape("RoundedRectangle", {
          fill: "transparent",
          strokeWidth: 1,
        }) // 状态机 _final 为真时，内部加一层细线边框
          .bind(stateFinalPanelMarginBinding())
          .bind(stateFinalPanelStrokeWidthBinding())
          .bind(stateFinalPanelStrokeBinding())
          .bind(stateFinalPanelDesiredSizeBinding())
      )
      // state 头部色块和文字
      .add(stateTitle())
      // state 头部色块的底边框
      .add(
        new Shape("lineH", {
          strokeWidth: 1,
        })
          .bind(stateFinalTitleBorderBinding())
          .bind(stateFinalTitleBorderLengthBinding())
          .bind(stateFinalTitleBorderVisibleBinding())
      )
      // state 头部色块 Initial = true 时右侧的小图标
      .add(
        new Shape({
          figure: "Initial", // 实心部分
          strokeWidth: 1,
          maxSize: new Size(12, 11),
        })
          .bind(stateFinalIconPositionBinding())
          .bind(stateInitialBinding())
      )
      .add(
        new Shape({
          figure: "Initial1", // 线条部分
          strokeWidth: 1,
          maxSize: new Size(12, 11),
        })
          .bind(stateFinalIconPositionBinding())
          .bind(stateInitialBinding())
      );

  export const state = () =>
    new Group("Spot", {
      ...GraphConfig.groupConfig,
      defaultStretch: GraphObject.Horizontal,
      dragComputation: myDragComputation,
      portSpreading: Node.SpreadingNone,
    })
      .add(
        new Shape("RoundedRectangle", {
          name: GraphConfig.NODE_NAME,
          stroke: "black",
          strokeWidth: 2,
          portId: "",
          minSize: new Size(90, 54),
        })
          .bind(sizeBinding().makeTwoWay())
          .bind(stateMachineFillBinding())
      )
      //直接叠在上面
      .add(stateContentPanel())
      //作为边的样式,扩大link范围
      .add(
        new Shape("RoundedRectangle", {
          cursor: GraphConfig.LINKABLE_CURSOR,
          fill: null,
          stroke: "transparent",
          strokeWidth: 4,
          fromLinkable: true,
          fromLinkableSelfNode: true,
          fromLinkableDuplicates: true,
          toLinkable: true,
          toLinkableSelfNode: true,
          toLinkableDuplicates: true,
        })
          .bind(portIdBinding())
          .bind(sizeBinding().makeTwoWay())
          .bind(
            new Binding("stroke", "isHighlighted", (h) =>
              h ? "rgba(255,0,0,0.5)" : "transparent"
            ).ofObject()
          )
      )
      .bind(positionBinding());
}
//得到action的连接线与其最上边的距离
export const getActionOffest_Y = (part: Part) => {
  return part.actualBounds.height * GroupTemplate.ActionGroupToSpot.y;
};
