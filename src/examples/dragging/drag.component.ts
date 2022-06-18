import { Directive, Input, OnDestroy, OnInit, Optional } from "@angular/core";
import { Subscription } from "rxjs";

import { Group, Matrix4, Raycaster } from "three";

import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { XRControllerComponent } from "../xr-controller/xr-controller.component";
import { TrackedPointerDirective } from "../xr-controller/trackpointer.component";


@Directive({
  selector: '[drag]',
})
export class DragDirective implements OnInit, OnDestroy {
  private _dragEnabled: BooleanInput = true;
  @Input()
  get drag(): boolean { return coerceBooleanProperty(this._dragEnabled) }
  set drag(newvalue: BooleanInput) {
    this._dragEnabled = newvalue;
    this.unhighlight();
  }
  @Input() room!: Group;

  private controller!: Group;
  private dragging?: any;
  private subs = new Subscription();

  constructor(
    private xr: XRControllerComponent,
    @Optional() private tp: TrackedPointerDirective,
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.room) {
      console.warn('Drag directive requires room Group to be set');
      return;
    }

    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;
      this.controller = next.controller;
    }));

    this.subs.add(this.xr.triggerstart.subscribe(next => {
      if (this.drag) {
        if (this.PointerIntersectObject) {
          this.controller.attach(this.PointerIntersectObject);
          this.dragging = this.PointerIntersectObject;

          if (this.tp?.line) {
            this.tp.line.scale.z = this.PointerIntersect.distance;
          }
        }
      }
    }));

    this.subs.add(this.xr.triggerend.subscribe(next => {
      if (this.drag) {
        if (this.dragging) {
          this.dragging.material.emissive.b = 0;

          this.room.attach(this.dragging);

          this.dragging = undefined;
          if (this.tp?.line) {
            this.tp.line.scale.z = 1.5;
          }
        }
      }
    }));

    this.subs.add(this.xr.beforeRender.subscribe(next => {
      if (this.drag) this.tick();
    }));
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

  private unhighlight() {
    if (this.PointerIntersectObject) {
      this.PointerIntersectObject.material.emissive.b = 0;
      this.PointerIntersectObject = undefined;
    }
  }

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
        this.unhighlight();
      }
    }
  }
}
