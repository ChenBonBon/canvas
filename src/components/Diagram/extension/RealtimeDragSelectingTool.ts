/*
 *  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
 */

/*
 * This is an extension and not part of the main GoJS library.
 * Note that the API for this class may change with any version, even point releases.
 * If you intend to use an extension in production, you should copy the code to your own source directory.
 * Extensions can be found in the GoJS kit under the extensions or extensionsTS folders.
 * See the Extensions intro page (https://gojs.net/latest/intro/extensions.html) for more information.
 */
import * as go from 'gojs';
import { GQLNode } from '../GoDiagramRepresentation.types';

/**
 * The RealtimeDragSelectingTool class lets the user select and deselect Parts within the {@link DragSelectingTool#box}
 * during a drag, not just at the end of the drag.
 *
 * If you want to experiment with this extension, try the <a href="../../extensionsJSM/RealtimeDragSelecting.html">Realtime Drag Selecting</a> sample.
 * @category Tool Extension
 */
export class RealtimeDragSelectingTool extends go.DragSelectingTool {
  private _originalSelection: go.Set<go.Part> = new go.Set<go.Part>();
  private _temporarySelection: go.Set<go.Part> = new go.Set<go.Part>();
  private readonly onSelectElements: (selectedElement: GQLNode[]) => void;
  /**
   * Constructs a DragSelectingTool and sets the name for the tool.
   */
  constructor({ onSelectElements }: any) {
    super();
    this.name = 'RealtimeDragSelectingTool';
    this.onSelectElements = onSelectElements;
  }

  /**
   * Remember the original collection of selected Parts.
   */
  public doActivate(): void {
    super.doActivate();
    // keep a copy of the original Set of selected Parts
    this._originalSelection = this.diagram.selection.copy();
    // these Part.isSelected may have been temporarily modified
    this._temporarySelection.clear();
    this.diagram.raiseDiagramEvent('ChangingSelection');
  }

  /**
   * Release any references to selected Parts.
   */
  public doDeactivate(): void {
    this.diagram.raiseDiagramEvent('ChangedSelection');
    this._originalSelection.clear();
    this._temporarySelection.clear();
    super.doDeactivate();
  }

  /**
   * Restore the selection which may have been modified during a drag.
   */
  public doCancel(): void {
    const orig = this._originalSelection;
    orig.each(function (p) {
      p.isSelected = true;
    });
    this._temporarySelection.each(function (p) {
      if (!orig.contains(p)) p.isSelected = false;
    });
    super.doCancel();
  }

  /**
   * Select Parts within the bounds of the drag-select box.
   */
  public doMouseMove(): void {
    if (this.isActive) {
      super.doMouseMove();
      this.selectInRect(this.computeBoxBounds());
    }
  }

  /**
   * Select Parts within the bounds of the drag-select box.
   */
  public doKeyDown(): void {
    if (this.isActive) {
      super.doKeyDown();
      this.selectInRect(this.computeBoxBounds());
    }
  }

  /**
   * Select Parts within the bounds of the drag-select box.
   */
  public doKeyUp(): void {
    if (this.isActive) {
      super.doKeyUp();
      this.selectInRect(this.computeBoxBounds());
    }
  }

  /**
   * For a given rectangle, select Parts that are within that rectangle.
   * @param {Rect} r rectangular bounds in document coordinates.
   */
  public selectInRect(r: go.Rect): void {
    const diagram = this.diagram;
    const orig = this._originalSelection;
    const temp = this._temporarySelection;
    const e = diagram.lastInput;
    const found = diagram.findPartsIn(r, this.isPartialInclusion);
    if (e.control || e.meta) {
      // toggle or deselect
      if (e.shift) {
        // deselect only
        temp.each(function (p: go.Part) {
          if (!found.contains(p)) p.isSelected = orig.contains(p);
        });
        found.each(function (p: go.Part) {
          p.isSelected = false;
          temp.add(p);
        });
      } else {
        // toggle selectedness of parts based on _originalSelection
        temp.each(function (p: go.Part) {
          if (!found.contains(p)) p.isSelected = orig.contains(p);
        });
        found.each(function (p: go.Part) {
          p.isSelected = !orig.contains(p);
          temp.add(p);
        });
      }
    } else if (e.shift) {
      // extend selection only
      temp.each(function (p: go.Part) {
        if (!found.contains(p)) p.isSelected = orig.contains(p);
      });
      found.each(function (p: go.Part) {
        p.isSelected = true;
        temp.add(p);
      });
    } else {
      const selectElements: GQLNode[] = [];
      // select found parts, and unselect all other previously selected parts
      temp.each(function (p: go.Part) {
        if (!found.contains(p)) p.isSelected = false;
      });
      orig.each(function (p: go.Part) {
        if (!found.contains(p)) p.isSelected = false;
      });
      found.each(function (p: go.Part) {
        p.isSelected = true;
        if (p.data && p.data.targetObjectId && p.data.targetObjectKind) {
          selectElements.push(p.data);
        }
        temp.add(p);
      });
      this.onSelectElements(selectElements);
    }
  }
}
