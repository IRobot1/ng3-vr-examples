import { Component, EventEmitter, Input, Output } from "@angular/core";

import { Mesh } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";
import { PathPoint } from "../path-util";

@Component({
  selector: 'path-point',
  exportAs: 'pathPoint',
  templateUrl: './path-point.component.html',
})
export class PathPointComponent extends NgtObjectProps<Mesh> {
  @Input() point!: PathPoint;
  @Input() size = 0.01;

  @Input() selectable?: InteractiveObjects;

  @Output() dragging = new EventEmitter<Mesh|undefined>();

  private mesh!: Mesh;

  protected startdrag() {
    this.dragging.next(this.mesh);
  }

  protected enddrag() {
    this.dragging.next(undefined);
  }

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.click.next(e.data); e.stop = true; })
    mesh.addEventListener('pointerdown', (e: any) => { this.startdrag(); })
    mesh.addEventListener('pointerup', (e: any) => { this.enddrag(); })

    this.mesh = mesh;
    this.point.mesh = mesh;

    this.ready.next(mesh);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh)
}

  doclick(event: NgtEvent<MouseEvent>, mesh: Mesh) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.click.next(event);
  }
}
