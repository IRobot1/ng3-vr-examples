import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group, Intersection, Mesh, Object3D, Vector3 } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { DRAG_END_EVENT, DRAG_MOVE_EVENT, DRAG_START_EVENT } from "ng3-flat-ui";


@Component({
  selector: 'flat-ui-node-drag-pin',
  exportAs: 'flatUINodeDragPin',
  templateUrl: './drag-pin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUINodeDragPin extends NgtObjectProps<Group> {
  @Input() target!: Object3D;
  object: any;

  override ngOnInit() {

  }

  mesh!: Mesh;

  private isover = false;
  over() {
    if (this.isover) return;

    //this.line.visible = true;
    this.isover = true;
  }
  out() {
    //this.line.visible = false;
    this.isover = false;
  }

  dragging = false;
  protected startdragging() {
    this.dragging = true;
    this.over();
    this.target.dispatchEvent({ type: DRAG_START_EVENT })
  }

  protected enddragging() {
    this.dragging = false;
    this.out();
    this.target.dispatchEvent({ type: DRAG_END_EVENT })
  }

  protected movepin(event: NgtEvent<PointerEvent>) {
    event.stopPropagation();

    this.domovepin(event);
  }

  private domovepin(event: Intersection) {

    if (this.dragging) {

      const position = new Vector3();
      this.mesh.getWorldPosition(position);

      this.mesh.position.x += event.point.x - position.x;
      this.mesh.position.y += event.point.y - position.y;

      this.target.dispatchEvent({ type: DRAG_MOVE_EVENT, event })
    }
  }

}
