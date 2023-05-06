import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import { useEffect, useRef, useState } from "react";
import { GQLNode } from "./GoDiagramRepresentation.types";
import { GraphConfig } from "./constant";
import model from "./diagramModel";
import { RealtimeDragSelectingTool } from "./extension/RealtimeDragSelectingTool";
import { ResizeMultipleTool } from "./extension/ResizeMultipleTool";
import "./index.css";
import registerRuler from "./ruler";
import registerTemplate from "./template/TemplateRegistry";
import { LinkLabelDraggingTool } from "./tools/LinkLabelDraggingTool";

interface IDiagram {
  diagramData: any;
}

function initDiagram() {
  const $ = go.GraphObject.make;
  const graphLinksModel = new go.GraphLinksModel(model);

  go.Diagram.licenseKey = import.meta.env.VITE_GO_LICENSE;
  // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
  const diagram = $(go.Diagram, {
    grid: $(
      go.Panel,
      "Grid",
      { gridCellSize: new go.Size(4, 4) },
      $(go.Shape, "LineH", { stroke: "transparent", strokeWidth: 1 }),
      $(go.Shape, "LineV", { stroke: "transparent", strokeWidth: 1 })
    ),
    "draggingTool.isGridSnapEnabled": true,
    "animationManager.initialAnimationStyle": go.AnimationManager.None,
    "undoManager.isEnabled": true,
    // 'grid.visible': true,
    scrollMode: go.Diagram.InfiniteScroll,
    model: graphLinksModel,
    initialContentAlignment: go.Spot.Center,
    initialDocumentSpot: go.Spot.Center,
    initialViewportSpot: go.Spot.Center,
    layout: $(go.Layout),
  });

  diagram.toolManager.dragSelectingTool = new RealtimeDragSelectingTool({
    onSelectElements: (selectedElements: GQLNode[]) => {
      console.log(selectedElements);
    },
  });

  diagram.toolManager.dragSelectingTool.box = $(
    go.Part,
    {
      layerName: "Tool",
      selectable: false,
    },
    $(go.Shape, "Rectangle", {
      fill: null,
      strokeDashArray: GraphConfig.DASH_ARRAY,
    })
  );

  diagram.toolManager.resizingTool = new ResizeMultipleTool();
  diagram.toolManager.mouseMoveTools.insertAt(0, new LinkLabelDraggingTool());
  // diagram.undoManager.maxHistoryLength = 0
  registerTemplate(diagram);
  registerRuler(diagram);

  return diagram;
}

function handleModelChange() {
  console.log("GoJS model changed!");
}

export default function Diagram(props: IDiagram) {
  const diagramRef = useRef<any>();

  const [nodeDataArray, setNodeDataArray] = useState<any[]>([]);
  const [linkDataArray, setLinkDataArray] = useState<any[]>([]);

  useEffect(() => {
    const { nodes: newNodeDataArray, edges: newLinkDataArray } =
      props.diagramData;

    if (newNodeDataArray) {
      setNodeDataArray([...newNodeDataArray]);
    }

    if (newLinkDataArray) {
      setLinkDataArray([...newLinkDataArray]);
    }
  }, [props.diagramData, props.fullReload]);

  return (
    <ReactDiagram
      ref={diagramRef}
      initDiagram={initDiagram}
      divClassName="diagram-component"
      nodeDataArray={nodeDataArray}
      linkDataArray={linkDataArray}
      onModelChange={handleModelChange}
    />
  );
}
