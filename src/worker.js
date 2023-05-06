import Mock from "mockjs";
import { CreateEdgeCommand, DropCommand } from "./components/Diagram/commands";

let commands = [];
const allCommands = [];

function generateNodeData() {
  const targetObjectId = Mock.Random.guid();
  const targetObjectLabel = Mock.Random.name();
  const x = Mock.Random.integer(-10000, 10000);
  const y = Mock.Random.integer(-10000, 10000);

  if (commands.length >= 1) {
    allCommands.push(commands);
    commands = [];
    commands.push(new DropCommand(x, y, null, "create_inputNode"));
  } else {
    commands.push(new DropCommand(x, y, null, "create_inputNode"));
  }

  return {
    kind: "Node",
    id: Mock.Random.guid(),
    type: "local_in",
    descriptionId: "local_in",
    targetObjectId: "" + targetObjectId,
    targetObjectKind:
      "siriusComponents://semantic?domain=smave&entity=Equation",
    targetObjectLabel: targetObjectLabel,
    properties: null,
    size: {
      width: 25,
      height: 25,
    },
    angle: 0,
    rotatable: true,
    shapes: [
      {
        kind: "Shape",
        id: "local_in_SHAPE_shape" + targetObjectId,
        type: "SHAPE",
        descriptionId: "local_in_SHAPE_shape",
        align: {
          x: 0.5,
          y: 0.5,
        },
        color: "#DDDDFF",
        figure: "local_in",
        scale: {
          width: 1,
          height: 1,
        },
      },
    ],
    labels: [
      {
        kind: "Label",
        id: "local_in_INSTANCE_label" + targetObjectId,
        type: "INSTANCE",
        descriptionId: "local_in_INSTANCE_label",
        parentId: null,
        targetObjectId: null,
        text: targetObjectLabel,
        align: {
          x: 0.75,
          y: 0.25,
        },
        font: "8pt sans-serif",
        editable: true,
        color: "#000000",
      },
    ],
    borderNodes: [
      {
        kind: "Port",
        id: Mock.Random.guid(),
        type: "rightPort",
        descriptionId: "localNode_rightPort",
        targetObjectId: Mock.Random.guid(),
        targetObjectKind:
          "siriusComponents://semantic?domain=smave&entity=Variable",
        targetObjectLabel: "_L1",
        properties: null,
        align: {
          x: 1,
          y: 0.5,
        },
      },
    ],
    loc: {
      x: x,
      y: y,
    },
  };
}

function generateEdgeData(nodes) {
  const targetObjectId = Mock.Random.guid();
  const length = nodes.length;
  const sourceIndex = Math.floor(Math.random() * length);
  const targetIndex = Math.floor(Math.random() * length);
  const sourceNode = nodes[sourceIndex];
  const targetNode = nodes[targetIndex];
  const sourceNodeId = sourceNode.id;
  const targetNodeId = targetNode.id;

  if (commands.length >= 100) {
    allCommands.push(commands);
    commands = [];
    commands.push(new CreateEdgeCommand(sourceNodeId, targetNodeId, "edge"));
  } else {
    commands.push(new CreateEdgeCommand(sourceNodeId, targetNodeId, "edge"));
  }

  return {
    kind: "Edge",
    id: Mock.Random.guid(),
    type: "edge",
    targetObjectId: targetObjectId,
    targetObjectKind:
      "siriusComponents://semantic?domain=smave&entity=Variable",
    targetObjectLabel: "_L1",
    descriptionId: "edge",
    labels: [],
    sourceId: sourceNodeId,
    targetId: targetNodeId,
    style: {
      id: "edge",
    },
    routingPoints: [sourceNode.loc, targetNode.loc],
    sourceAnchor: {
      x: -1,
      y: -1,
    },
    targetAnchor: {
      x: -1,
      y: -1,
    },
  };
}

onmessage = function (event) {
  const { data } = event;
  if (data === "start") {
    this.postMessage({
      diagram: [
        {
          id: "00000000000",
          kind: null,
          targetObjectId: null,
          descriptionId: null,
          label: null,
          position: null,
          size: null,
          nodes: [
            {
              kind: "Node",
              id: "node_b91cacfa-c920-4664-b3dc-1c7f24450e0d",
              type: "plusNAryNode",
              descriptionId: "plusNAryNode",
              targetObjectId: "b91cacfa-c920-4664-b3dc-1c7f24450e0d",
              targetObjectKind:
                "siriusComponents://semantic?domain=smave&entity=Equation",
              targetObjectLabel: "plus1",
              properties: null,
              size: { width: 56, height: 56 },
              angle: 0,
              rotatable: true,
              shapes: [
                {
                  kind: "Shape",
                  id: "plusNAryNode_SHAPE_shapeb91cacfa-c920-4664-b3dc-1c7f24450e0d",
                  type: "SHAPE",
                  descriptionId: "plusNAryNode_SHAPE_shape",
                  align: { x: 0.5, y: 0.5 },
                  color: "#FFF4E6",
                  figure: "plusNAryNode",
                  scale: { width: 1, height: 1 },
                },
              ],
              labels: [
                {
                  kind: "Label",
                  id: "plusNAryNode_INSTANCE_labelb91cacfa-c920-4664-b3dc-1c7f24450e0d",
                  type: "INSTANCE",
                  descriptionId: "plusNAryNode_INSTANCE_label",
                  parentId: null,
                  targetObjectId: null,
                  text: "plus1",
                  align: { x: 0.75, y: 0.25 },
                  font: "8pt sans-serif",
                  editable: true,
                  color: "#FF0000",
                },
              ],
              borderNodes: [
                {
                  kind: "Port",
                  id: "p1_b91cacfa-c920-4664-b3dc-1c7f24450e0d",
                  type: "leftPort",
                  descriptionId: "plusNAryNode_leftPort",
                  targetObjectId: "7a05db73-463d-4b2d-9d2b-01b8ee9557a6",
                  targetObjectKind:
                    "siriusComponents://semantic?domain=smave&entity=IdExpression",
                  targetObjectLabel:
                    "com.formaltech.smave.web.model.impl.IdExpressionImpl@c499768 (analyzed: false)",
                  properties: null,
                  align: { x: 0, y: 0.33 },
                },
                {
                  kind: "Port",
                  id: "p2_b91cacfa-c920-4664-b3dc-1c7f24450e0d",
                  type: "leftPort",
                  descriptionId: "plusNAryNode_leftPort",
                  targetObjectId: "d18a629f-0409-4e94-9501-d7de5eb09c86",
                  targetObjectKind:
                    "siriusComponents://semantic?domain=smave&entity=IdExpression",
                  targetObjectLabel:
                    "com.formaltech.smave.web.model.impl.IdExpressionImpl@73e7cec8 (analyzed: false)",
                  properties: null,
                  align: { x: 0, y: 0.67 },
                },
                {
                  kind: "Port",
                  id: "p3_b91cacfa-c920-4664-b3dc-1c7f24450e0d",
                  type: "rightPort",
                  descriptionId: "plusNAryNode_rightPort",
                  targetObjectId: "03aaa2d1-5d96-4162-adfa-3041c7e98daf",
                  targetObjectKind:
                    "siriusComponents://semantic?domain=smave&entity=Variable",
                  targetObjectLabel: "_L1",
                  properties: null,
                  align: { x: 1, y: 0.5 },
                },
              ],
              loc: { x: 715.8194502461081, y: -478.9958653186983 },
            },
            {
              kind: "Node",
              id: "node_0d1c8f71-322b-44a9-a4c8-9ed17ddf2538",
              type: "plusNAryNode",
              descriptionId: "plusNAryNode",
              targetObjectId: "0d1c8f71-322b-44a9-a4c8-9ed17ddf2538",
              targetObjectKind:
                "siriusComponents://semantic?domain=smave&entity=Equation",
              targetObjectLabel: "plus2",
              properties: null,
              size: { width: 56, height: 56 },
              angle: 0,
              rotatable: true,
              shapes: [
                {
                  kind: "Shape",
                  id: "plusNAryNode_SHAPE_shape0d1c8f71-322b-44a9-a4c8-9ed17ddf2538",
                  type: "SHAPE",
                  descriptionId: "plusNAryNode_SHAPE_shape",
                  align: { x: 0.5, y: 0.5 },
                  color: "#FFF4E6",
                  figure: "plusNAryNode",
                  scale: { width: 1, height: 1 },
                },
              ],
              labels: [
                {
                  kind: "Label",
                  id: "plusNAryNode_INSTANCE_label0d1c8f71-322b-44a9-a4c8-9ed17ddf2538",
                  type: "INSTANCE",
                  descriptionId: "plusNAryNode_INSTANCE_label",
                  parentId: null,
                  targetObjectId: null,
                  text: "plus2",
                  align: { x: 0.75, y: 0.25 },
                  font: "8pt sans-serif",
                  editable: true,
                  color: "#FF0000",
                },
              ],
              borderNodes: [
                {
                  kind: "Port",
                  id: "p1_0d1c8f71-322b-44a9-a4c8-9ed17ddf2538",
                  type: "leftPort",
                  descriptionId: "plusNAryNode_leftPort",
                  targetObjectId: "7a05db73-463d-4b2d-9d2b-01b8ee9557a6",
                  targetObjectKind:
                    "siriusComponents://semantic?domain=smave&entity=IdExpression",
                  targetObjectLabel:
                    "com.formaltech.smave.web.model.impl.IdExpressionImpl@c499768 (analyzed: false)",
                  properties: null,
                  align: { x: 0, y: 0.33 },
                },
                {
                  kind: "Port",
                  id: "p2_0d1c8f71-322b-44a9-a4c8-9ed17ddf2538",
                  type: "leftPort",
                  descriptionId: "plusNAryNode_leftPort",
                  targetObjectId: "d18a629f-0409-4e94-9501-d7de5eb09c86",
                  targetObjectKind:
                    "siriusComponents://semantic?domain=smave&entity=IdExpression",
                  targetObjectLabel:
                    "com.formaltech.smave.web.model.impl.IdExpressionImpl@73e7cec8 (analyzed: false)",
                  properties: null,
                  align: { x: 0, y: 0.67 },
                },
                {
                  kind: "Port",
                  id: "p3_0d1c8f71-322b-44a9-a4c8-9ed17ddf2538",
                  type: "rightPort",
                  descriptionId: "plusNAryNode_rightPort",
                  targetObjectId: "03aaa2d1-5d96-4162-adfa-3041c7e98daf",
                  targetObjectKind:
                    "siriusComponents://semantic?domain=smave&entity=Variable",
                  targetObjectLabel: "_L1",
                  properties: null,
                  align: { x: 1, y: 0.5 },
                },
              ],
              loc: { x: -36.12577036021287, y: -833.803533322305 },
            },
            {
              kind: "Node",
              id: "node_a11746de-4496-4076-8105-257ca0fe7924",
              type: "plusNAryNode",
              descriptionId: "plusNAryNode",
              targetObjectId: "a11746de-4496-4076-8105-257ca0fe7924",
              targetObjectKind:
                "siriusComponents://semantic?domain=smave&entity=Equation",
              targetObjectLabel: "plus3",
              properties: null,
              size: { width: 56, height: 56 },
              angle: 0,
              rotatable: true,
              shapes: [
                {
                  kind: "Shape",
                  id: "plusNAryNode_SHAPE_shapea11746de-4496-4076-8105-257ca0fe7924",
                  type: "SHAPE",
                  descriptionId: "plusNAryNode_SHAPE_shape",
                  align: { x: 0.5, y: 0.5 },
                  color: "#FFF4E6",
                  figure: "plusNAryNode",
                  scale: { width: 1, height: 1 },
                },
              ],
              labels: [
                {
                  kind: "Label",
                  id: "plusNAryNode_INSTANCE_labela11746de-4496-4076-8105-257ca0fe7924",
                  type: "INSTANCE",
                  descriptionId: "plusNAryNode_INSTANCE_label",
                  parentId: null,
                  targetObjectId: null,
                  text: "plus3",
                  align: { x: 0.75, y: 0.25 },
                  font: "8pt sans-serif",
                  editable: true,
                  color: "#FF0000",
                },
              ],
              borderNodes: [
                {
                  kind: "Port",
                  id: "p1_a11746de-4496-4076-8105-257ca0fe7924",
                  type: "leftPort",
                  descriptionId: "plusNAryNode_leftPort",
                  targetObjectId: "7a05db73-463d-4b2d-9d2b-01b8ee9557a6",
                  targetObjectKind:
                    "siriusComponents://semantic?domain=smave&entity=IdExpression",
                  targetObjectLabel:
                    "com.formaltech.smave.web.model.impl.IdExpressionImpl@c499768 (analyzed: false)",
                  properties: null,
                  align: { x: 0, y: 0.33 },
                },
                {
                  kind: "Port",
                  id: "p2_a11746de-4496-4076-8105-257ca0fe7924",
                  type: "leftPort",
                  descriptionId: "plusNAryNode_leftPort",
                  targetObjectId: "d18a629f-0409-4e94-9501-d7de5eb09c86",
                  targetObjectKind:
                    "siriusComponents://semantic?domain=smave&entity=IdExpression",
                  targetObjectLabel:
                    "com.formaltech.smave.web.model.impl.IdExpressionImpl@73e7cec8 (analyzed: false)",
                  properties: null,
                  align: { x: 0, y: 0.67 },
                },
                {
                  kind: "Port",
                  id: "p3_a11746de-4496-4076-8105-257ca0fe7924",
                  type: "rightPort",
                  descriptionId: "plusNAryNode_rightPort",
                  targetObjectId: "03aaa2d1-5d96-4162-adfa-3041c7e98daf",
                  targetObjectKind:
                    "siriusComponents://semantic?domain=smave&entity=Variable",
                  targetObjectLabel: "_L1",
                  properties: null,
                  align: { x: 1, y: 0.5 },
                },
              ],
              loc: { x: 100.0, y: 101.0 },
            },
          ],
          edges: [],
        },
      ],
    });
  }
};
