import { Binding, Margin, Node, Point, Shape, Size, Spot } from "gojs";
import { GQLPosition, GQLSize } from "../GoDiagramRepresentation.types";
import { GraphColor, GraphConfig } from "../constant";
import { NodeDesign } from "../design";
import { GPosition, GShape, IGraphObject } from "../graph";
import { toFixInt } from "../util";

export type Function<T, R> = (val: T) => R;

export const positionBinding = () =>
  new Binding(
    "location",
    "loc",
    (val: GQLPosition) => new Point(val.x, val.y)
  ).makeTwoWay((point) => ({
    x: toFixInt(point.x),
    y: toFixInt(point.y),
  }));

export const sizeBinding = (func?: Function<number, number>) =>
  new Binding("desiredSize", "size", (val: GQLSize) => {
    if (func) {
      return new Size(func(val.width), func(val.height));
    } else {
      return new Size(val.width, val.height);
    }
  });

export const scalableMarginBinding = (func: Function<GQLSize, Margin>) =>
  new Binding("margin", "size", (val: GQLSize) => func(val));

export const labelBinding = () => new Binding("text", "targetObjectLabel");

export const portIdBinding = () => new Binding("portId", "id");

export const portItemBinding = () => new Binding("itemArray", "borderNodes");
export const itemBinding = () => new Binding("itemArray", "items");
export const portAlignBinding = () =>
  new Binding("alignment", "align", (val: GPosition) => new Spot(val.x, val.y));
export const portFromSpotBinding = () =>
  new Binding("fromSpot", "align", getPortFromToSpot);
export const portToSpotBinding = () =>
  new Binding("toSpot", "align", getPortFromToSpot);
export const alignmentBinding = () =>
  new Binding("alignment", "align", (val) => new Spot(val.x, val.y));
export const alignmentFocusBinding = () =>
  new Binding("alignmentFocus", "align", getPortAlignmentFocus);
export const colorBinding = () => new Binding("stroke", "color");

export const angleBinding = () => new Binding("angle", "angle");
export const angleReverseBinding = () =>
  new Binding("angle", "angle", (angle) => -angle);

export const figureBinding = () =>
  new Binding("figure", "figure", (val) => {
    var reg = /^[a-z]+$/;
    return reg.test(val) ? val + "Node" : val;
  });
export const shapeSizeBinding = () =>
  new Binding("desiredSize", "scale", (val, obj) => {
    let size = obj.part.data.size;
    return new Size(size.width * val.width, size.height * val.height);
  });
export const labelMaxSizeBinding = () =>
  new Binding("maxSize", "", (val, obj) => {
    let size = obj.part.data.size;
    return new Size(size.width * 0.4, 20);
  });
export const shapeColorBinding = () => new Binding("fill", "color");
export const portLabelAlignBinding = () =>
  new Binding("alignment", "align", getPortLabelAlign);
export const labelAlignmentFocusBinding = () =>
  new Binding("alignmentFocus", "kind", (val, obj) => {
    let type = obj.part.data.type;
    return type === NodeDesign.assume || type === NodeDesign.guarantee
      ? Spot.Left
      : Spot.Center;
  });

export const highlightedBinding = () =>
  new Binding("fill", "isHighlighted", (value: boolean, targetObj: Node) => {
    if (value) return "#aaea9a";
    return GraphColor.nodeFill;
  }).ofObject();

/**
 * 通用模版方式绑定
 */
export const highlightedBinding2 = () =>
  new Binding("fill", "isHighlighted", (value: boolean, targetObj: Node) => {
    let shapes: GShape[] =
      targetObj.itemArray?.filter(
        (item: IGraphObject) => item.kind === "Shape"
      ) ?? [];

    if (shapes.length > 0) {
      let shapeData: GShape = shapes[shapes.length - 1];
      let panel = targetObj.findItemPanelForData(shapeData);
      let graphObject = panel?.findMainElement();
      if (graphObject instanceof Shape) {
        if (value) {
          graphObject.fill = "#aaea9a";
        } else {
          graphObject.fill = shapeData.color;
        }
      }
    }
  }).ofObject();

const getNodeDesignFromAlign = (val: GPosition) => {
  if (val.x === 0) return NodeDesign.leftPort;
  if (val.x === 1) return NodeDesign.rightPort;
  if (val.y === 0) return NodeDesign.topPort;
  if (val.y === 1) return NodeDesign.bottomPort;
  throw new EvalError(JSON.stringify(val));
};

const getPortFromToSpot = (v: GPosition) => {
  let val = getNodeDesignFromAlign(v);
  if (val === NodeDesign.leftPort) {
    return Spot.Left;
  } else if (val === NodeDesign.topPort) {
    return Spot.Top;
  } else if (val === NodeDesign.rightPort) {
    return Spot.Right;
  } else if (val === NodeDesign.bottomPort) {
    return new Spot(0.5, 1, 0, -(GraphConfig.portSize.height / 2));
  }
  throw new EvalError(JSON.stringify(val));
};

const getPortLabelAlign = (v: GPosition) => {
  let val = getNodeDesignFromAlign(v);
  let disToMiddle = 0.3;
  if (val === NodeDesign.leftPort) {
    return new Spot(0.5 + disToMiddle, 0.5);
  } else if (val === NodeDesign.topPort) {
    return new Spot(0.5, 0.5 + disToMiddle);
  } else if (val === NodeDesign.rightPort) {
    return new Spot(0.5 - disToMiddle, 0.5);
  } else if (val === NodeDesign.bottomPort) {
    return new Spot(0.5, 0.5 - disToMiddle);
  }
  throw new EvalError(JSON.stringify(val));
};

const getPortAlignmentFocus = (v: GPosition) => {
  let val = getNodeDesignFromAlign(v);
  if (val === NodeDesign.leftPort) {
    return Spot.Right;
  } else if (val === NodeDesign.topPort) {
    return Spot.Bottom;
  } else if (val === NodeDesign.rightPort) {
    return Spot.Left;
  } else if (val === NodeDesign.bottomPort) {
    return Spot.Default;
  }
  throw new EvalError(JSON.stringify(val));
};

// 状态机背景色：无子元素时有填充色，有子元素时只有顶部一行有填充色
export const stateMachineFillBinding = () =>
  new Binding("fill", "childNodes", (childNodes) => {
    return childNodes?.length > 0 ? "#fff" : GraphColor.stateTopBarColor;
  });

export const stateInitialBinding = () =>
  new Binding("visible", "properties", (styleDict) => {
    return styleDict.initial;
  });

const finalBorderGap = 4;
export const stateFinalPanelMarginBinding = () =>
  new Binding("margin", "properties", (styleDict) => {
    return styleDict._final ? finalBorderGap : 0;
  });

export const stateFinalTitleMarginBinding = () =>
  new Binding("margin", "properties", (styleDict) => {
    return styleDict._final ? finalBorderGap - 2 : 0;
  });

export const stateFinalPanelStrokeWidthBinding = () =>
  new Binding("strokeWidth", "properties", (styleDict) => {
    return styleDict._final ? 1 : 0;
  });

export const stateFinalPanelStrokeBinding = () =>
  new Binding("stroke", "properties", (styleDict) => {
    return styleDict._final ? "black" : "transparent";
  });

export const stateFinalPanelDesiredSizeBinding = () =>
  new Binding("desiredSize", "", (val) => {
    const { size, properties } = val;
    return new Size(
      size.width - (finalBorderGap * 2 - 1),
      properties._final
        ? size.height - (finalBorderGap * 2 - 1)
        : size.height - 2
    );
  });

// 状态机标题：无子元素时标题水平垂直居中，有子元素时占用顶部一行文字水平居中
const titleHeight = 20;
export const stateFinalTitleDesiredSizeBinding = () =>
  new Binding("desiredSize", "", (val) => {
    const { size, childNodes, properties } = val;
    const deltaW = finalBorderGap * 2;
    const deltaH = finalBorderGap * 2 + 3; // 外圈边框 2 内圈边框 1
    const width = size.width - (properties._final ? deltaW : 2);
    const height =
      childNodes?.length > 0
        ? titleHeight
        : size.height - (properties._final ? deltaH : 2);
    return new Size(width, height);
  });

export const stateFinalTitleStrokeWidthBinding = () =>
  new Binding("strokeWidth", "properties", (properties) => {
    return properties._final ? 6 : 4;
  });

export const stateTitleFillWidthBinding = () =>
  new Binding("fill", "childNodes", (childNodes) => {
    return childNodes?.length > 0 ? GraphColor.stateTopBarColor : "transparent";
  });

export const stateFinalTitleBorderBinding = () =>
  new Binding("margin", "properties", (properties) => {
    return properties._final
      ? new Margin(0, 0, 0, finalBorderGap)
      : new Margin(1 - finalBorderGap, 0, 0, 1);
  });

export const stateFinalTitleBorderLengthBinding = () =>
  new Binding("width", "", (val) => {
    const { size, properties } = val;
    const delta = properties._final ? finalBorderGap * 2 - 1 : 1;
    return Math.round(size.width - delta);
  });

// 状态机标题：仅在有子元素时标题底部有一条边框
export const stateFinalTitleBorderVisibleBinding = () =>
  new Binding("stroke", "childNodes", (childNodes) => {
    return childNodes?.length > 0 ? "#000" : "transparent";
  });

export const stateFinalIconPositionBinding = () =>
  new Binding("position", "", (val) => {
    const { size, properties } = val;
    const delta = properties._final ? finalBorderGap : 0;
    return new Point(
      size.width - (properties._final ? delta + 20 : 20),
      properties._final ? 8 : 6
    );
  });

//将labels数组中类型为labelType的label的sourceProp属性绑定至targetProp属性
export const specificLabelBinding = (
  labelType: any,
  targetProp: any,
  sourceProp: any,
  f?: any
) =>
  new Binding(targetProp, "labels", (labels) => {
    let target = labels.find((label: any) => label.type === labelType)[
      sourceProp
    ];
    return f ? f(target) : target;
  });
export const specificLabelTextBinding = (labelType: any) =>
  specificLabelBinding(labelType, "text", "text");
export const specificLabelNameBinding = (labelType: any) =>
  specificLabelBinding(labelType, "name", "id");
export const specificLabelSegmentOffsetBinding = (labelType: any) =>
  specificLabelBinding(
    labelType,
    "segmentOffset",
    "align",
    (val: any) => new Point(val.x, val.y)
  );
