import {
  Binding,
  Geometry,
  GraphObject,
  Map,
  Margin,
  Node,
  Panel,
  Part,
  PathFigure,
  PathSegment,
  Point,
  Shape,
  Size,
  Spot,
  TextBlock,
} from "gojs";
import { myDragComputation, reverseSpot } from "../common";
import { GraphColor, GraphConfig } from "../constant";
import { NodeDesign } from "../design";
import { lineTextEditor } from "../extension/TextEditor";
import {
  alignmentBinding,
  alignmentFocusBinding,
  angleBinding,
  angleReverseBinding,
  colorBinding,
  figureBinding,
  highlightedBinding,
  highlightedBinding2,
  itemBinding,
  labelAlignmentFocusBinding,
  labelBinding,
  labelMaxSizeBinding,
  portAlignBinding,
  portFromSpotBinding,
  portIdBinding,
  portItemBinding,
  portLabelAlignBinding,
  portToSpotBinding,
  positionBinding,
  scalableMarginBinding,
  shapeColorBinding,
  shapeSizeBinding,
  sizeBinding,
} from "./Bindings";
import { GroupTemplate } from "./GroupTemplate";

export namespace GraphItem {
  export const portItemTemplate = () =>
    new Panel(Panel.Auto, GraphConfig.portConfig)
      .add(
        new Shape({
          figure: "Rectangle",
          fill: GraphColor.portFill,
          stroke: GraphColor.portStroke,
          desiredSize: GraphConfig.portSize,
        })
      )
      .bind(portAlignBinding())
      .bind(portFromSpotBinding())
      .bind(portToSpotBinding())
      .bind(portIdBinding())
      .bind(alignmentFocusBinding());

  export const xPortItemTemplate = () =>
    new Panel(Panel.Spot)
      .add(
        new Shape({
          fill: null,
          stroke: null,
          desiredSize: new Size(40, 40),
        })
      )
      .add(
        new TextBlock("null", {})
          .bind(portLabelAlignBinding())
          .bind(labelBinding())
      )

      .add(
        new Shape({
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer",
          figure: "xLine",
          fill: GraphColor.portFill,
          stroke: GraphColor.portStroke,
          desiredSize: GraphConfig.portSize,
        })
          .bind(portFromSpotBinding())
          .bind(portToSpotBinding())
          .bind(portIdBinding())
      )
      .bind(portAlignBinding())
      .bind(alignmentFocusBinding());

  export const portItemTemplateMap = new Map<string, Panel>()
    .add(NodeDesign.defaultPort, xPortItemTemplate())
    .add(NodeDesign.topPort, portItemTemplate())
    .add(NodeDesign.bottomPort, xPortItemTemplate())
    .add(NodeDesign.leftPort, portItemTemplate())
    .add(NodeDesign.rightPort, portItemTemplate());

  export const pinTemplate = (spot: Spot, config: Partial<Panel>) =>
    new Panel(Panel.Spot, {
      fromSpot: spot,
      toSpot: spot,
      ...GraphConfig.portConfig,
      ...config,
    })
      .add(
        new Shape("LineH", {
          strokeWidth: 2,
          desiredSize: GraphConfig.pinSize,
          strokeCap: "square",
        })
      )
      .bind(portIdBinding());

  export const tempLinkToolNode = () =>
    new Node({ layerName: "Tool" }).add(
      new Shape("Rectangle", {
        portId: "",
        stroke: "#4CAF50",
        strokeWidth: 2,
        fill: null,
      })
    );

  export const rectangleClickArea = () =>
    new Shape("Rectangle", {
      isPanelMain: true,
      fill: "transparent",
      strokeWidth: 0,
    }).bind(sizeBinding().makeTwoWay());
}

export namespace NodeTemplate {
  //最通用的Node模板
  export const equationTemplate = (
    figure: string,
    figureFill?: Boolean,
    figureScale = 0.4
  ) => {
    return new Node(Panel.Spot, {
      ...GraphConfig.nodeConfig,
      itemTemplate: GraphItem.portItemTemplate(),
      itemTemplateMap: GraphItem.portItemTemplateMap,
      itemCategoryProperty: "type",
    })
      .bind(positionBinding())
      .add(
        new Panel(Panel.Auto, { stretch: GraphObject.Fill })
          .add(
            new Shape("Rectangle", {
              name: GraphConfig.NODE_NAME,
              fill: GraphColor.nodeFill,
              stroke: GraphConfig.SHAPE_STROKE,
              strokeWidth: 2,
            })
              .bind(highlightedBinding())
              .bind(sizeBinding().makeTwoWay())
          )
          .add(
            new Shape(figure, {
              fill: figureFill === undefined || figureFill ? "black" : null,
            }).bind(sizeBinding((val) => val * figureScale))
          )
          .add(
            new TextBlock({
              editable: true,
              font: "8pt sans-serif",
              alignment: Spot.TopRight,
              textEditor: lineTextEditor,
            })
              .bind(labelBinding())
              .bind(
                scalableMarginBinding(
                  (val) => new Margin(val.height * 0.1, val.width * 0.1, 0, 0)
                )
              )
          )
      )
      .bind(portItemBinding());
  };

  //Big figure
  export const equationBigFigureTemplate = (figure: string) => {
    return equationTemplate(figure, false, 1);
  };

  // make flatter
  export const make_flattenTemplate = (type?: string) => {
    let align = type === "make" ? Spot.Left : Spot.Right;
    return new Node(Panel.Spot, {
      ...GraphConfig.nodeConfig,
      itemTemplate: GraphItem.portItemTemplate(),
    })
      .bind(positionBinding())
      .add(
        new Panel(Panel.Auto, { stretch: GraphObject.Fill })
          .add(
            new Shape("Rectangle", {
              name: GraphConfig.NODE_NAME,
              fill: GraphColor.nodeFill,
              stroke: GraphColor.nodeStroke,
            })
              .bind(highlightedBinding())
              .bind(sizeBinding().makeTwoWay())
          )
          .add(
            new TextBlock({
              editable: true,
              font: "8pt sans-serif",
              alignment: Spot.TopRight,
              textEditor: lineTextEditor,
            })
              .bind(labelBinding())
              .bind(
                scalableMarginBinding(
                  (val) => new Margin(val.height * 0.1, val.width * 0.1, 0, 0)
                )
              )
          )
          .add(
            new Shape("Rectangle", {
              alignment: align,
              stroke: "white",
              fill: "white",
              desiredSize: new Size(2, 10000),
            })
          )
      )

      .bind(portItemBinding());
  };

  export const inputTemplate = () =>
    NodeTemplate.interfaceTemplate(
      "Input",
      new Spot(1.0, 0.5, 5), // label 在右侧
      GraphItem.pinTemplate(Spot.Right, {
        alignment: Spot.Right,
        alignmentFocus: new Spot(0.5, 0.5), //隐藏尖头
      })
    );

  export const outputTemplate = () =>
    NodeTemplate.interfaceTemplate(
      "Output",
      new Spot(0, 0.5, -10), // label 在左侧
      GraphItem.pinTemplate(Spot.Left, {
        alignment: Spot.Left,
        alignmentFocus: Spot.Left, //隐藏尖头
      })
    );
  export const probeTemplate = () =>
    NodeTemplate.interfaceTemplate(
      "Probe",
      Spot.Left, // label 在左侧
      GraphItem.pinTemplate(Spot.Left, {
        alignment: new Spot(0, 0.695),
        alignmentFocus: Spot.Left,
      })
    );
  export const localVariableOutTemplate = () =>
    NodeTemplate.interfaceTemplate(
      "LocalVariableOut",
      new Spot(-0.1, 0.5), // label 在左侧
      GraphItem.pinTemplate(Spot.Left, {
        alignment: Spot.Left,
        alignmentFocus: Spot.Left,
      }),
      GraphColor.localVariableColor
    );
  export const localVariableInTemplate = () =>
    NodeTemplate.interfaceTemplate(
      "LocalVariableIn",
      new Spot(1.1, 0.5),
      GraphItem.pinTemplate(Spot.Right, {
        alignment: Spot.Right,
        alignmentFocus: Spot.Right,
      }),
      GraphColor.localVariableColor
    );
  export const terminatorTemplate = () =>
    NodeTemplate.interfaceTemplate(
      "Terminator",
      Spot.Left, // label 在左侧
      GraphItem.pinTemplate(Spot.Left, {
        alignment: Spot.Center,
        alignmentFocus: Spot.Right,
      }),
      null,
      false
    );
  export const signalTemplate = () =>
    NodeTemplate.interfaceTemplate(
      NodeDesign.signal + "Node",
      Spot.Right, // label 在右侧
      GraphItem.pinTemplate(Spot.Right, {
        alignment: Spot.Right,
        alignmentFocus: Spot.Left,
      }),
      null
    );
  export const assumeTemplate = () =>
    NodeTemplate.interfaceKindTemplate(
      NodeDesign.assume + "Node",
      new Spot(-0.1, 0.5),
      GraphItem.pinTemplate(Spot.Right, {
        alignment: new Spot(0.55, 0.5),
        alignmentFocus: Spot.Left,
      }),
      null,
      true,
      "red"
    );
  export const guaranteeTemplate = () =>
    NodeTemplate.interfaceKindTemplate(
      NodeDesign.guarantee + "Node",
      new Spot(-0.1, 0.5),
      GraphItem.pinTemplate(Spot.Right, {
        alignment: new Spot(0.55, 0.5),
        alignmentFocus: Spot.Left,
      }),
      null,
      true,
      "red"
    );
  /**
   * in out 等基础块的通用模版
   */
  export const interfaceTemplate = (
    shape: string,
    pinSide: Spot,
    pinTemplate: Panel,
    fill?: string | null,
    hasText: boolean = true,
    textColor = "black"
  ) => {
    let f = fill ? fill : "transparent";
    let panel = new Panel(Panel.Spot, { stretch: GraphObject.Fill })
      .add(GraphItem.rectangleClickArea())
      .add(
        new Shape(shape, {
          name: GraphConfig.NODE_NAME,
          isPanelMain: true,
          fill: f,
          strokeWidth: 2,
        }).bind(sizeBinding().makeTwoWay())
      );
    const template = new Node(Panel.Spot, {
      ...GraphConfig.nodeConfig,
      itemTemplate: pinTemplate,
      locationSpot: Spot.Center,
    })
      .bind(positionBinding())
      .bind(portItemBinding())
      .bind(angleBinding());
    if (hasText) {
      return template.add(
        panel.add(
          new TextBlock({
            editable: true,
            alignment: reverseSpot(pinSide),
            alignmentFocus: pinSide,
            stroke: textColor,
          })
            .bind(labelBinding())
            .bind(angleReverseBinding())
        )
      );
    }
    return template.add(panel);
  };

  export const interfaceKindTemplate = (
    shape: string,
    pinSide: Spot,
    pinTemplate: Panel,
    fill?: string | null,
    hasText: boolean = true,
    textColor = "black"
  ) => {
    let f = fill ? fill : "transparent";
    let panel = new Panel(Panel.Spot, { stretch: GraphObject.Fill })
      .add(GraphItem.rectangleClickArea())
      .add(
        new Shape(shape, {
          name: GraphConfig.NODE_NAME,
          isPanelMain: true,
          fill: f,
          strokeWidth: 2,
        }).bind(sizeBinding().makeTwoWay())
      );
    return new Node(Panel.Spot, {
      ...GraphConfig.nodeConfig,
      itemCategoryProperty: "kind",
      itemTemplateMap: itemTemplateMap,
      locationSpot: Spot.Center, // 使位置数据定位在图形的中心
    })
      .bind(positionBinding())
      .add(panel)
      .bind(itemBinding());
  };

  export const textualExprNodeTemplate = () => {
    return new Node(Panel.Spot, {
      ...GraphConfig.selectableNodeConfig,
      locationSpot: Spot.Center, // 使位置数据定位在图形的中心
      itemTemplate: GraphItem.pinTemplate(Spot.Right, {
        alignment: new Spot(1.0, 0.5, 10),
        alignmentFocus: Spot.Left,
      }),
    })
      .bind(positionBinding())
      .add(
        new Panel(Panel.Spot, { stretch: GraphObject.Fill })
          .add(GraphItem.rectangleClickArea())
          .add(
            new TextBlock({
              name: GraphConfig.NODE_NAME,
              editable: true,
              alignment: Spot.Center,
              textAlign: "center",
              verticalAlignment: Spot.Center,
            }).bind(labelBinding())
          )
      )
      .bind(portItemBinding());
  };
  const generalInnerPanel = (outerFigure: string) => {
    return new Panel(Panel.Auto, { stretch: GraphObject.Fill })
      .add(
        new Shape(outerFigure, {
          name: GraphConfig.NODE_NAME,
          fill: GraphColor.nodeFill,
          stroke: GraphConfig.SHAPE_STROKE,
          strokeWidth: 2,
        })
          .bind(highlightedBinding())
          .bind(sizeBinding().makeTwoWay())
      )
      .add(
        new TextBlock({
          editable: true,
          font: "8pt sans-serif",
          alignment: Spot.TopRight,
        })
          .bind(labelBinding())
          .bind(
            scalableMarginBinding(
              (val) => new Margin(val.height * 0.1, val.width * 0.1, 0, 0)
            )
          )
      );
  };
  //用来处理外部不规则的node
  export const generalTemplate = (outerFigure: string, text?: string) => {
    let innerPanel = generalInnerPanel(outerFigure);
    if (text) innerPanel.add(new TextBlock(text));
    return new Node(Panel.Spot, {
      ...GraphConfig.nodeConfig,
      itemTemplate: GraphItem.portItemTemplate(),
    })
      .bind(positionBinding())
      .add(innerPanel)
      .bind(portItemBinding());
  };

  function makePort(name: any, spot: any, output: any, input: any) {
    return new Shape("Circle", {
      fill: null,
      stroke: null,
      desiredSize: new Size(5, 5),
      alignment: spot,
      alignmentFocus: spot,
      portId: name,
      fromSpot: spot,
      toSpot: spot,
      fromLinkable: output,
      toLinkable: input,
      cursor: "pointer",
    });
  }

  export const ifNodeTemplate = () =>
    new Node("Auto", {
      ...GraphConfig.selectableConfig,
      dragComputation: (thisPart: Part, newLoc: Point, snappedLoc: Point) => {
        //最终的拖拽位置
        let target = newLoc;
        let thisNode = thisPart.diagram?.findNodeForKey(thisPart.key);
        let it_node;
        it_node = thisNode?.findNodesInto();
        //保证当前ifNode同上级对齐
        while (it_node?.next()) {
          target.x = it_node.value.location.x;
        }
        //根据所有下级的thenAction位置确定当前ifNode的x范围
        let ifNode = thisNode;
        while (ifNode) {
          let nextIfNode;
          it_node = ifNode.findNodesOutOf();
          while (it_node.next()) {
            if (it_node.value.category === NodeDesign.thenNode) {
              target.x = Math.min(
                target.x,
                it_node.value.position.x -
                  GroupTemplate.intervalDistance -
                  (thisNode?.actualBounds.width ?? 0)
              );
            }
            if (it_node.value.category === NodeDesign.ifNode) {
              nextIfNode = it_node.value;
            }
          }
          ifNode = nextIfNode;
        }
        target = myDragComputation(thisPart, target, snappedLoc);
        return target;
      },
    })
      .bind(positionBinding())
      .add(new Panel("Auto"))
      .add(
        new Shape("Diamond", {
          name: GraphConfig.NODE_NAME,
          fill: "#FFF4E5",
          strokeWidth: 2,
          width: 20,
          height: 20,
        })
      )
      .add(makePort("T", Spot.Top, false, true))
      .add(makePort("L", Spot.Left, true, true))
      .add(makePort("R", Spot.Right, true, true))
      .add(makePort("B", Spot.Bottom, true, false));

  export const whenNode = () =>
    new Node("Horizontal", {
      ...GraphConfig.selectableConfig,
      locationObjectName: GraphConfig.NODE_NAME,
      dragComputation: (thisPart: Part, newLoc: Point, snappedLoc: Point) => {
        //最终的拖拽位置
        let target = newLoc;
        let thisNode = thisPart.diagram?.findNodeForKey(thisPart.key);
        let it_node = thisNode?.findNodesOutOf();
        it_node?.next();
        let whenNode = it_node?.value;
        while (whenNode) {
          let nextWhenNode;
          it_node = whenNode.findNodesOutOf();
          while (it_node.next()) {
            if (it_node.value.category === NodeDesign.whenMatch) {
              //考虑到所有下级ifNode的情况
              target.x = Math.min(
                target.x,
                it_node.value.position.x -
                  GroupTemplate.intervalDistance -
                  (thisNode?.actualBounds.width ?? 0)
              );
            } else {
              nextWhenNode = it_node.value;
            }
          }
          whenNode = nextWhenNode;
        }

        target = myDragComputation(thisPart, target, snappedLoc);
        return target;
      },
    })
      .bind(positionBinding())
      .add(
        new Shape("Ellipse", {
          name: GraphConfig.NODE_NAME,
          //应该加上这个属性以防止连线中心偏移
          portId: "",
          fill: "#FFF4E5",
          strokeWidth: 2,
          width: 20,
          height: 20,
        })
      )
      .add(
        new TextBlock({
          margin: 5,
          editable: true,
          stroke: "Black",
        }).bind(new Binding("text", "targetObjectLabel").makeTwoWay())
      );

  export const whenMatch = () =>
    new Node("Auto", {
      ...GraphConfig.selectableConfig,
      dragComputation: (thisPart: Part, newLoc: Point, snappedLoc: Point) => {
        //最终的拖拽位置
        let target = newLoc;
        let thisNode = thisPart.diagram?.findNodeForKey(thisPart.key);
        let it_node = thisNode?.findNodesInto();
        while (it_node?.next()) {
          target.x = it_node.value.location.x;
        }
        target = myDragComputation(thisPart, target, snappedLoc);
        return target;
      },
    })
      .bind(positionBinding())
      .add(
        new Shape({
          geometry: new Geometry().add(
            new PathFigure(10, 0, true)
              .add(new PathSegment(PathSegment.Line, 20, 10))
              .add(new PathSegment(PathSegment.Line, 10, 20))
              .add(new PathSegment(PathSegment.Line, 10, 0))
          ),
          name: GraphConfig.NODE_NAME,
          fill: "#FFF4E5",
          strokeWidth: 2,
          width: 20,
          height: 20,
        })
      );

  export const ifThenElseTemplate = () => {
    return new Node(Panel.Spot, {
      ...GraphConfig.nodeConfig,
      itemCategoryProperty: "kind",
      itemTemplateMap: itemTemplateMap,
    })
      .bind(positionBinding())
      .add(
        new Panel(Panel.Auto, { stretch: GraphObject.Fill })
          .add(
            new Shape("Rectangle", {
              name: GraphConfig.NODE_NAME,
              fill: null,
              stroke: null,
            }).bind(sizeBinding().makeTwoWay())
          )
          .add(new Shape(NodeDesign.ifThenElse).bind(sizeBinding((val) => val)))
          .add(
            new TextBlock({
              editable: true,
              font: "8pt sans-serif",
              alignment: Spot.TopRight,
              textEditor: lineTextEditor,
            })
              .bind(labelBinding())
              .bind(
                scalableMarginBinding(
                  (val) => new Margin(val.height * 0.1, val.width * 0.1, 0, 0)
                )
              )
          )
      )
      .bind(portItemBinding());
  };

  const signalEmitpinTemplate = () =>
    new Panel(Panel.Spot, {
      fromSpot: Spot.Top,
      toSpot: Spot.Top,
      ...GraphConfig.portConfig,
      alignment: new Spot(0.3, 0),
      alignmentFocus: Spot.Bottom,
    })
      .add(
        new Shape("LineV", {
          strokeWidth: 2,
          desiredSize: new Size(1, 4),
          strokeCap: "square",
        })
      )
      .bind(portIdBinding());
  export const signalEmitTemplate = () =>
    NodeTemplate.interfaceTemplate(
      NodeDesign.signalEmit,
      new Spot(0, 0.5, -5),
      signalEmitpinTemplate(),
      null
    );

  // 针脚 eg: plus 左右两侧的小短线
  export const portTypeTemplate = () =>
    new Panel(Panel.Auto, {
      ...GraphConfig.portConfig,
    })
      .add(
        new Shape({
          fill: GraphColor.portFill,
          stroke: GraphConfig.SHAPE_STROKE,
          strokeWidth: 2,
          desiredSize: GraphConfig.portSize,
          strokeCap: "square",
        }).bind("figure", "type")
      )
      .bind(portAlignBinding())
      .bind(portFromSpotBinding())
      .bind(portToSpotBinding())
      .bind(portIdBinding())
      .bind(alignmentFocusBinding());

  export const forkTemplate = () =>
    new Node(Panel.Spot, {
      ...GraphConfig.selectableConfig,
    })
      .add(
        new Shape("Circle", {
          name: GraphConfig.NODE_NAME,
          stroke: "#FAFAFA",
          strokeWidth: 2,
          fill: "black",
          geometryString:
            "FM0.5 10a9.5 9.5 0 1 0 19 0a9.5 9.5 0 1 0 -19 0zM15.105957 5.039295h-5c-2.209139 0-4 1.790861-4 4v7.0170282M6.105957 10.4358099h6.87834574",
        }).bind(sizeBinding())
      )
      .add(
        new Shape("Circle", {
          cursor: GraphConfig.LINKABLE_CURSOR,
          fill: null,
          stroke: "transparent",
          strokeWidth: 3,
          fromLinkable: true,
          fromLinkableDuplicates: true,
        })
          .bind(portIdBinding())
          .bind(sizeBinding((val) => val - 3))
      )
      .bind(positionBinding());

  export const shapeTemplate = () =>
    new Panel(Panel.Auto, {}).bind(alignmentBinding()).add(
      new Shape({
        fill: "transparent",
        strokeWidth: 2,
      })
        .bind(figureBinding())
        .bind(shapeColorBinding())
        .bind(shapeSizeBinding())
    );

  export const labelPanelTemplate = () =>
    new Panel(Panel.Auto)
      .add(
        new TextBlock({
          editable: true,
          textEditor: lineTextEditor,
          wrap: TextBlock.WrapDesiredSize,
        })
          .bind("text", "text")
          .bind("font", "font")
          .bind(colorBinding())
          .bind(labelMaxSizeBinding())
      )
      .bind(alignmentBinding())
      .bind(labelAlignmentFocusBinding());

  // 图形 + label + 针脚 eg: plus
  export const itemTemplateMap = new Map<string, Panel>()
    .add("Port", portTypeTemplate())
    .add("Shape", shapeTemplate())
    .add("Label", labelPanelTemplate());

  export const equationGeneralTemplate = () => {
    return new Node(Panel.Spot, {
      ...GraphConfig.nodeConfig,
      itemCategoryProperty: "kind",
      itemTemplateMap: itemTemplateMap,
      locationSpot: Spot.Center,
    })
      .bind(angleBinding())
      .add(
        new Shape("Rectangle", {
          name: GraphConfig.NODE_NAME,
          stretch: GraphObject.Fill,
          fill: null,
          stroke: null,
        }).bind(sizeBinding().makeTwoWay())
      )
      .bind(highlightedBinding2())
      .bind(positionBinding())
      .bind(itemBinding());
  };
}
