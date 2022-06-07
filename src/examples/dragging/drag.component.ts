import { Directive, Input, OnInit, Optional } from "@angular/core";

import { Group, Matrix4, Raycaster } from "three";

import { XRControllerComponent } from "../teleport/xr-controller/xr-controller.component";
import { TrackedPointerDirective } from "../teleport/xr-controller/trackpointer.component";


@Directive({
  selector: '[drag]',
})
export class DragDirective implements OnInit {
  @Input() room!: Group;

  private controller!: Group;
  private selected?: any;

  constructor(
    private xr: XRControllerComponent,
    @Optional() private tp: TrackedPointerDirective,
  ) { }

  ngOnInit(): void {
    if (!this.room) {
      console.warn('Drag directive requires room Group to be set');
      return;
    }

    this.xr.connected.subscribe(next => {
      this.controller = next.controller;
    });

    this.xr.selectstart.subscribe(next => {
      if (this.PointerIntersectObject) {
        this.controller.attach(this.PointerIntersectObject);
        this.selected = this.PointerIntersectObject;

        if (this.tp?.line) {
          this.tp.line.scale.z = this.PointerIntersect.distance;
        }
      }
    });

    this.xr.selectend.subscribe(next => {
      if (this.selected) {
        this.selected.material.emissive.b = 0;

        this.room.attach(this.selected);

        this.selected = undefined;
          if (this.tp?.line) {
            this.tp.line.scale.z = 1.5;
          }
      }
    });

    this.xr.beforeRender.subscribe(next => {
      this.tick();
    })
  }

  private getPointerIntersections(): any {
    const tempMatrix = new Matrix4();

    tempMatrix.identity().extractRotation(this.controller.matrixWorld);

    const raycaster = new Raycaster();

    raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(this.room.children, false);
  }

  private PointerIntersect: any;
  private PointerIntersectObject: any;

  private tick() {
    if (this.room && this.controller) {

      const intersects = this.getPointerIntersections();

      if (intersects.length > 0) {
        if (this.PointerIntersectObject != intersects[0].object) {

          if (this.PointerIntersectObject) this.PointerIntersectObject.material.emissive.b = 0;

          this.PointerIntersect = intersects[0];
          this.PointerIntersectObject = this.PointerIntersect.object;
          this.PointerIntersectObject.material.emissive.b = 1;
        }
      } else {
        if (this.PointerIntersectObject) {
          this.PointerIntersectObject.material.emissive.b = 0;
          this.PointerIntersectObject = undefined;
        }

      }
    }
  }
}
