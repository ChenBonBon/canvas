import { Point, Size } from "gojs";
import { GPosition } from "./graph";

export interface IDiagramCommand {
  kind: string;
}

export abstract class SingleElementCommand implements IDiagramCommand {
  readonly kind: string;
  readonly objectId: string;

  protected constructor(kind: string, objectId: string) {
    this.kind = kind;
    this.objectId = objectId;
  }
}

export class CompoundCommand implements IDiagramCommand {
  readonly kind = "CompoundCommand";
  readonly commands: IDiagramCommand[];

  constructor(...events: IDiagramCommand[]) {
    this.commands = events;
  }
}

export class MoveCommand extends SingleElementCommand {
  readonly x: number;
  readonly y: number;

  constructor(objectId: string, point: Point) {
    super("MoveCommand", objectId);
    this.x = point.x;
    this.y = point.y;
  }
}

export class ResizeCommand extends SingleElementCommand {
  readonly width: number;
  readonly height: number;

  constructor(objectId: string, size: Size) {
    super("ResizeCommand", objectId);
    this.width = size.width;
    this.height = size.height;
  }
}

export class RotateCommand extends SingleElementCommand {
  readonly angle: number;

  constructor(objectId: string, angle: any) {
    super("RotateCommand", objectId);
    this.angle = angle;
  }
}

export class EditLabelCommand extends SingleElementCommand {
  readonly labelId: string;
  readonly newValue: string;

  constructor(objectId: string, labelId: string, newValue: string) {
    super("EditLabelCommand", objectId);
    this.labelId = labelId;
    this.newValue = newValue;
  }
}

export class DropCommand implements IDiagramCommand {
  readonly kind = "DropCommand";
  x: number;
  y: number;
  targetId?: string;
  toolId?: string;
  sourceId?: string;

  public constructor(
    x: number,
    y: number,
    targetId: string,
    toolId?: string,
    sourceId?: string
  ) {
    this.x = x;
    this.y = y;
    this.targetId = targetId;
    this.toolId = toolId;
    this.sourceId = sourceId;
  }
}

export class CreateEdgeCommand extends SingleElementCommand {
  readonly targetId: string;
  readonly type: string;

  constructor(objectId: string, targetId: string, type: string) {
    super("CreateEdgeCommand", objectId);
    this.targetId = targetId;
    this.type = type;
  }
}

export class DeleteCommand extends SingleElementCommand {
  readonly type: string;
  readonly diagramElementId: String;

  constructor(type: string, diagramElementId: String, objectId: string) {
    super("DeleteCommand", objectId);
    this.type = type;
    this.diagramElementId = diagramElementId;
  }
}

export class ChangeAnchorCommand extends SingleElementCommand {
  readonly isSource: boolean;
  readonly newPoint: GPosition;

  constructor(objectId: string, isSource: boolean, point: Point) {
    super("ChangeAnchorCommand", objectId);
    this.isSource = isSource;
    this.newPoint = { x: point.x, y: point.y };
  }
}

export class ChangeRoutingPointsCommand extends SingleElementCommand {
  indices: number[];
  newPoints: GPosition[];

  constructor(objectId: string, indices: number[], newPoints: GPosition[]) {
    super("ChangeRoutingPointsCommand", objectId);
    this.indices = indices;
    this.newPoints = newPoints;
  }
}

export class GetSmaveEdgeCandidateInput implements IDiagramCommand {
  readonly kind: string = "GetSmaveEdgeCandidateInput";
}
