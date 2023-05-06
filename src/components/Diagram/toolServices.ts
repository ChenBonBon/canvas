import { EdgeCandidate } from "./GoDiagramRepresentation.types";

/**
 * 当前source/target是否可以建立连接
 */
export function canCreateEdge(
  edgeCandidates: EdgeCandidate[],
  sourceElement: any,
  targetElement: any
) {
  return edgeCandidates.some(
    (edgeCandidate) =>
      edgeCandidate.sources.some(
        (source) => source.id === sourceElement.descriptionId
      ) &&
      edgeCandidate.targets.some(
        (target) => target.id === targetElement.descriptionId
      )
  );
}

/**
 * 获取当前port的可选目标
 */
export function getCandidates(
  edgeCandidates: EdgeCandidate[],
  port: any
): string[] {
  for (let edgeCandidate of edgeCandidates) {
    if (
      edgeCandidate.sources.some((source) => source.id === port.descriptionId)
    ) {
      return edgeCandidate.targets.map((it) => it.id);
    }
    if (
      edgeCandidate.targets.some((target) => target.id === port.descriptionId)
    ) {
      return edgeCandidate.sources.map((it) => it.id);
    }
  }
  return [];
}
