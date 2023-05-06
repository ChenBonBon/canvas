import { VirtualEdge, VirtualNode } from "./constant";
import { EdgeDesign, LabelDesign, NodeDesign } from "./design";
import {
  GContainer,
  GDiagram,
  GEdge,
  GLabel,
  GNode,
  IGraphObject,
  INode,
} from "./graph";
import { GoContainer, GoEdge, GoNode, IGoNode } from "./graphExtension";
import { GroupTemplate } from "./template/GroupTemplate";

/**
 * Convert the given diagram object to a Sprotty diagram.
 *
 * SiriusWeb diagram and Sprotty diagram does not match exactly the same API.
 * This converter will ensure the creation of a proper Sprotty diagram from a given Sirius Web diagram..
 *
 * @param diagram the diagram object to convert
 * @param httpOrigin the URL of the server hosting the images
 * @param readOnly Whether the diagram is readonly
 * @return a Sprotty diagram object
 */
export const convertDiagram = (diagram: GDiagram, readOnly: boolean) => {
  const { id, targetObjectId } = diagram;
  // @ts-ignore
  // diagram = fakeTimeDiagram;
  //portId->Node
  const ports = new Map<string, GNode>();
  const nodes: INode[] = [];
  const edges: GEdge[] = [];

  const context: Context = { ports, nodes, edges };
  diagram.nodes.forEach((node) => {
    context.ifBlockRoots = [];
    convertINode(context, node, readOnly);
  });
  edges.push(
    ...diagram.edges.map((edge) => convertEdge(ports, edge as GoEdge, readOnly))
  );

  return {
    id,
    targetObjectId,
    nodes,
    edges,
  };
};

type Context = {
  ports: Map<string, GNode>;
  nodes: INode[];
  edges: GEdge[];
  ifBlockRoots?: IGraphObject[];
};

function convertINode(context: Context, node: INode, readOnly: boolean) {
  if (node.kind === "Container") {
    convertContainer(context, node as GoContainer, readOnly);
  } else if (node.kind === "Node") {
    convertNode(context, node as GoNode, readOnly);
  } else {
    context.nodes.push(node);
  }
}

function convertContainer(
  context: Context,
  container: GoContainer,
  readOnly: boolean
) {
  container.isGroup = true;
  if (
    container.type === NodeDesign.elseNode &&
    container.childNodes.some(
      (childNode) => childNode.type === NodeDesign.ifNode
    )
  ) {
    //过滤嵌套else
  } else {
    context.nodes.push(container);
  }

  const { edges } = context;
  const ifBlockRoots = context.ifBlockRoots ?? [];

  if (container.type === NodeDesign.ifBlock) {
    ifBlockRoots.push(container);
    convertIfBlock(container, container.childNodes, edges, ifBlockRoots);
  } else if (
    container.childNodes.some(
      (childNode) => childNode.type === NodeDesign.ifNode
    )
  ) {
    convertIfBlock(container, container.childNodes, edges, ifBlockRoots);
  } else if (container.type === NodeDesign.whenBlock) {
    convertWhenBlock(container, context.nodes, edges);
  } else {
    container.childNodes.forEach((childNode) => {
      childNode.group = container.id;
    });
  }

  container.childNodes.forEach((childNode) =>
    convertINode(context, childNode, readOnly)
  );
}

function convertIfBlock(
  parent: GContainer,
  childNodes: IGoNode[],
  edges: any[],
  ifBlockRoots: IGraphObject[]
) {
  const ifNode: GoNode = childNodes[0] as GoNode;
  const thenNode = childNodes[1];
  const elseNode = childNodes[2] as GoContainer;
  childNodes.forEach((childNode) => {
    childNode.group = ifBlockRoots[ifBlockRoots.length - 1].id;
  });

  // 提取ifNode中的text作为线的text
  let label: GLabel = ifNode.labels.find(
    (item) => item.type === LabelDesign.INSTANCE
  ) as GLabel;
  let text = label ? label.text : "";
  edges.push(
    createLogicEdge(thenNode.id, VirtualEdge.then, ifNode.id, thenNode.id, text)
  );

  // //如果不是开始，则一定会与上个ifnode相连
  let nextIf: IGoNode | undefined = elseNode.childNodes.find(
    (childNode) => childNode.type === NodeDesign.ifNode
  );
  if (nextIf)
    edges.push(
      createLogicEdge(ifNode.id, VirtualEdge.else, ifNode.id, nextIf.id)
    );

  //如果else是实体，就直接连线
  edges.push(
    createLogicEdge(
      elseNode.id,
      VirtualEdge.else,
      ifNode.id,
      elseNode.id,
      undefined,
      "B"
    )
  );
}

function createLogicEdge(
  id: string,
  type: string,
  from: string,
  to: string,
  label?: string,
  sourceId?: string,
  targetId?: string
) {
  return {
    id: id,
    type: type,
    targetObjectLabel: label,
    from: from,
    to: to,
    sourceId: sourceId,
    targetId: targetId,
  };
}

const setLogicNode: (id: string, type: string, loc: any) => any = (
  id: string,
  type: string,
  loc: any
) => {
  return {
    id: id,
    type: type,
    loc: loc,
  };
};

function convertNode(
  context: Context,
  parent: GoNode,
  readOnly: boolean
): GoNode {
  const { ports } = context;
  let borderNodes: any[] = [];
  if (parent.borderNodes) {
    borderNodes = convertBorders(ports, parent as GNode, true);
  }
  parent.items = [];
  parent.items.push(...parent.shapes, ...parent.labels, ...borderNodes);

  context.nodes.push(parent);
  return parent;
}

function convertBorders(
  ports: Map<string, GNode>,
  parent: GNode,
  readOnly: boolean
) {
  return parent.borderNodes.map((port) => {
    ports.set(port.id, parent);
    return port;
  });
}

const handleEditableLabel = (label: GLabel, readOnly: boolean) => {
  let editableLabel = undefined;
  if (!readOnly) {
    editableLabel = label;
  }
  return editableLabel;
};

const convertLabel = (label: any, readOnly: boolean) => {
  let convertedLabel = { ...label };
  if (!readOnly) {
    convertedLabel = {
      ...convertedLabel,
      readOnly,
    };
  }
  return convertedLabel;
};

function convertEdge(
  ports: Map<string, GNode>,
  edge: GoEdge,
  readOnly: boolean
): GoEdge {
  const { sourceId, targetId } = edge;

  if (edge.type === EdgeDesign.edge) {
    edge.from = ports.get(sourceId)?.id ?? "";
    edge.to = ports.get(targetId)?.id ?? "";
    edge.sourceId = sourceId;
    edge.targetId = targetId;
  } else {
    edge.from = sourceId;
    edge.to = targetId;
  }
  return edge;
}

function convertWhenBlock(node: GoContainer, nodes: any[], edges: any[]) {
  for (let i = 0; i < node.childNodes.length; i++) {
    node.childNodes[i].group = node.id;
    if (i !== 0) {
      let x = (node.childNodes[0] as GoNode).loc.x;
      let y = (node.childNodes[i] as GoNode).loc.y;
      let matchID = node.childNodes[i].id;
      let vituralID = matchID + "_0";
      let innerID = matchID + "_1";
      let outerID = matchID + "_2";
      // [config] logicNode.height == 20
      let logicNode = setLogicNode(vituralID, VirtualNode.whenMatch, {
        x: x,
        y:
          y -
          10 +
          GroupTemplate.ActionGroupToSpot.y *
            (node.childNodes[i] as GoNode).size.height,
      });
      logicNode["group"] = node.id;
      nodes.push(logicNode);
      edges.push(
        createLogicEdge(innerID, VirtualEdge.whenInner, vituralID, matchID)
      );
      //若当前i为1，则上一个节点为whenNode;反之为上一个vituralNode，需要推算出其id
      let preNodeId =
        i === 1 ? node.childNodes[0].id : node.childNodes[i - 1].id + "_0";
      edges.push(
        createLogicEdge(outerID, VirtualEdge.whenOuter, preNodeId, vituralID)
      );
    }
  }
}
