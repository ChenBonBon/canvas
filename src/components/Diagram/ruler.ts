import {
  Diagram,
  DraggingTool,
  DragSelectingTool,
  Link,
  LinkingTool,
  Part,
  Point,
  Shape,
  Spot,
  TextBlock,
  ToolManager,
} from "gojs";

const createGradScaleHoriz = () =>
  new Part("Graduated", {
    graduatedTickUnit: 10,
    pickable: false,
    layerName: "Grid",
    isAnimated: false,
  })
    .add(
      new Shape({
        geometryString: "M0 0 H400",
        stroke: "#ccc",
        segmentOffset: new Point(0, 10),
      })
    )
    .add(
      new Shape("LineV", {
        interval: 1,
        stroke: "#ccc",
        strokeWidth: 1,
        width: 1,
        height: 8,
      })
    )
    .add(
      new Shape({
        geometryString: "M0 0 V15",
        interval: 5,
        stroke: "#ccc",
        width: 1,
        height: 16,
      })
    )
    .add(
      new TextBlock({
        font: "10px sans-serif",
        stroke: "#737373",
        interval: 5,
        alignmentFocus: Spot.TopLeft,
        segmentOffset: new Point(4, 7),
      })
    );

const createGradScaleVert = () =>
  new Part("Graduated", {
    graduatedTickUnit: 10,
    pickable: false,
    layerName: "Grid",
    isAnimated: false,
  })
    .add(new Shape({ geometryString: "M0 0 V400" }))
    .add(
      new Shape({
        geometryString: "M0 0 V3",
        interval: 1,
        alignmentFocus: Spot.Bottom,
        stroke: "#ccc",
      })
    )
    .add(
      new Shape({
        geometryString: "M0 0 V15",
        interval: 5,
        alignmentFocus: Spot.Bottom,
        stroke: "#ccc",
      })
    )
    .add(
      new TextBlock({
        font: "10px sans-serif",
        stroke: "#737373",
        segmentOrientation: Link.OrientOpposite,
        interval: 5,
        alignmentFocus: Spot.BottomLeft,
        segmentOffset: new Point(4, -7),
      })
    );

const createGradIndicatorHoriz = () =>
  new Part({
    pickable: false,
    layerName: "Grid",
    visible: false,
    isAnimated: false,
    locationSpot: Spot.Top,
  }).add(
    new Shape({ geometryString: "M0 0 V15", strokeWidth: 2, stroke: "#FF9500" })
  );

const createGradIndicatorVert = () =>
  new Part({
    pickable: false,
    layerName: "Grid",
    visible: false,
    isAnimated: false,
    locationSpot: Spot.Left,
  }).add(
    new Shape({ geometryString: "M0 0 H15", strokeWidth: 2, stroke: "#FF9500" })
  );

function updateScales(
  diagram: Diagram,
  gradScaleHoriz: any,
  gradScaleVert: any
) {
  const vb = diagram.viewportBounds;
  if (!vb.isReal()) return;
  diagram.commit((diag) => {
    // Update properties of horizontal scale to reflect viewport
    gradScaleHoriz.elt(0).width = vb.width * diag.scale;
    gradScaleHoriz.location = new Point(vb.x, vb.y);
    gradScaleHoriz.graduatedMin = vb.x;
    gradScaleHoriz.graduatedMax = vb.right;
    gradScaleHoriz.scale = 1 / diag.scale;
    // Update properties of vertical scale to reflect viewport
    gradScaleVert.elt(0).height = vb.height * diag.scale;
    gradScaleVert.location = new Point(vb.x, vb.y);
    gradScaleVert.graduatedMin = vb.y;
    gradScaleVert.graduatedMax = vb.bottom;
    gradScaleVert.scale = 1 / diag.scale;
  }, null);
}

function updateIndicators(
  diagram: Diagram,
  gradIndicatorHoriz: any,
  gradIndicatorVert: any
) {
  var vb = diagram.viewportBounds;
  if (!vb.isReal()) return;
  diagram.commit((diag) => {
    var mouseCoords = diag.lastInput.documentPoint;
    // Keep the indicators in line with the mouse as viewport changes or mouse moves
    gradIndicatorHoriz.location = new Point(
      Math.max(mouseCoords.x, vb.x),
      vb.y
    );
    gradIndicatorHoriz.scale = 1 / diag.scale;
    gradIndicatorVert.location = new Point(vb.x, Math.max(mouseCoords.y, vb.y));
    gradIndicatorVert.scale = 1 / diag.scale;
  }, null);
}

// Show indicators on mouseEnter of the diagram div; hide on mouseLeave
function showIndicators(
  diagram: Diagram,
  show: any,
  gradIndicatorHoriz: any,
  gradIndicatorVert: any
) {
  diagram.commit(() => {
    gradIndicatorHoriz.visible = show;
    gradIndicatorVert.visible = show;
  }, null);
}

export default function registerRuler(diagram: Diagram) {
  const gradScaleHoriz = createGradScaleHoriz();
  const gradScaleVert = createGradScaleVert();
  const gradIndicatorHoriz = createGradIndicatorHoriz();
  const gradIndicatorVert = createGradIndicatorVert();

  diagram.addDiagramListener("InitialLayoutCompleted", () => {
    diagram.commit((d) => {
      // Add each node to the diagram
      d.add(gradScaleHoriz);
      d.add(gradScaleVert);
      d.add(gradIndicatorHoriz);
      d.add(gradIndicatorVert);
      updateScales(diagram, gradScaleHoriz, gradScaleVert);
      updateIndicators(diagram, gradIndicatorHoriz, gradIndicatorVert);
    }, null); // null says to skip UndoManager recording of changes
  });
  diagram.mouseEnter = () =>
    showIndicators(diagram, true, gradIndicatorHoriz, gradIndicatorVert);
  diagram.mouseLeave = () =>
    showIndicators(diagram, false, gradIndicatorHoriz, gradIndicatorVert);
  diagram.addDiagramListener("ViewportBoundsChanged", () => {
    updateScales(diagram, gradScaleHoriz, gradScaleVert);
    updateIndicators(diagram, gradIndicatorHoriz, gradIndicatorVert);
  });

  diagram.toolManager.doMouseMove = function () {
    ToolManager.prototype.doMouseMove.call(this);
    updateIndicators(diagram, gradIndicatorHoriz, gradIndicatorVert);
  };
  diagram.toolManager.linkingTool.doMouseMove = function () {
    LinkingTool.prototype.doMouseMove.call(this);
    updateIndicators(diagram, gradIndicatorHoriz, gradIndicatorVert);
  };
  diagram.toolManager.draggingTool.doMouseMove = function () {
    DraggingTool.prototype.doMouseMove.call(this);
    updateIndicators(diagram, gradIndicatorHoriz, gradIndicatorVert);
  };
  diagram.toolManager.dragSelectingTool.doMouseMove = function () {
    DragSelectingTool.prototype.doMouseMove.call(this);
    updateIndicators(diagram, gradIndicatorHoriz, gradIndicatorVert);
  };
}
