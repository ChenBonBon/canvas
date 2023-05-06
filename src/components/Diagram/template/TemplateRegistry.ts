import { Diagram, Group, Link, Map, Part } from "gojs";
import "gojs/extensions/Figures";
import { VirtualEdge, VirtualNode } from "../constant";
import { EdgeDesign, NodeDesign } from "../design";
import "../extension/MyFigures";
import { GroupTemplate } from "./GroupTemplate";
import { LinkTemplate, commonLink } from "./LinkTemplate";
import { NodeTemplate } from "./NodeTemplate";

const nodeTemplateMap = new Map<string, Part>()

  //Creation
  .add(NodeDesign.inputNode, NodeTemplate.inputTemplate())
  .add(NodeDesign.outputNode, NodeTemplate.outputTemplate())
  .add(NodeDesign.lastNode, NodeTemplate.outputTemplate())
  .add(NodeDesign.hidden, NodeTemplate.equationTemplate("Help"))
  .add(NodeDesign.local_out, NodeTemplate.localVariableOutTemplate())
  .add(NodeDesign.local_in, NodeTemplate.localVariableInTemplate())
  .add(NodeDesign.probeNode, NodeTemplate.probeTemplate())
  .add(NodeDesign.signal, NodeTemplate.signalTemplate())
  .add(NodeDesign.signalEmit, NodeTemplate.signalEmitTemplate())
  .add(NodeDesign.signalLast, NodeTemplate.equationTemplate("Help"))
  .add(NodeDesign.textualExprNode, NodeTemplate.textualExprNodeTemplate())
  .add(NodeDesign.guarantee, NodeTemplate.guaranteeTemplate())
  .add(NodeDesign.terminator, NodeTemplate.terminatorTemplate())

  //if
  .add(NodeDesign.ifNode, NodeTemplate.ifNodeTemplate())

  //when
  .add(VirtualNode.whenMatch, NodeTemplate.whenMatch())
  .add(NodeDesign.whenNode, NodeTemplate.whenNode())

  .add(NodeDesign.fork, NodeTemplate.forkTemplate())
  //default common template
  .add("", NodeTemplate.equationGeneralTemplate());

const linkTemplateMap = new Map<string, Link>()
  .add(EdgeDesign.edge, commonLink())
  .add(VirtualEdge.then, LinkTemplate.thenLink())
  .add(VirtualEdge.else, LinkTemplate.elseLink())
  //when
  .add(VirtualEdge.whenInner, LinkTemplate.whenInner())
  .add(VirtualEdge.whenOuter, LinkTemplate.whenOuter())
  //sm
  .add(EdgeDesign.transition, LinkTemplate.transition());

const groupTemplateMap = new Map<string, Group>()
  .add(NodeDesign.ifBlock, GroupTemplate.IfBlockGroup())
  .add(NodeDesign.thenNode, GroupTemplate.ThenGroup())
  .add(NodeDesign.elseNode, GroupTemplate.ElseGroup())
  //when
  .add(NodeDesign.whenBlock, GroupTemplate.WhenBlockGroup())
  .add(NodeDesign.whenMatch, GroupTemplate.WhenMatchGroup())
  //stateMachine
  .add(NodeDesign.stateMachine, GroupTemplate.stateMachine())
  .add(NodeDesign.state, GroupTemplate.state());

/**
 *   注册diagram所有模版
 */
export default function registerTemplate(diagram: Diagram) {
  diagram.nodeTemplateMap = nodeTemplateMap;
  diagram.linkTemplateMap = linkTemplateMap;
  diagram.groupTemplateMap = groupTemplateMap;
}
