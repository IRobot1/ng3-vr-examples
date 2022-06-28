import { Directive, Input, OnDestroy, OnInit, Optional } from "@angular/core";
import { Subscription } from "rxjs";

import { Group, Matrix4, Object3D, Raycaster } from "three";

import { BooleanInput, coerceBooleanProperty, NgtStore } from "@angular-three/core";

import { XRControllerComponent } from "../xr-controller/xr-controller.component";
import { TrackedPointerDirective } from "../xr-controller/trackpointer.directive";


@Directive({
  selector: '[drag]',
})
export class DragDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get drag(): boolean { return coerceBooleanProperty(this._enabled) }
  set drag(newvalue: BooleanInput) {
    this._enabled = newvalue;
    this.unhighlight();
  }
  @Input() todrag: Array<Object3D> = [];
  @Input() recursive = false;

  private controller!: Group;
  private dragging?: any;
  private subs = new Subscription();

  constructor(
    private xr: XRControllerComponent,
    private store: NgtStore,
    @Optional() private tp: TrackedPointerDirective,
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    const scene = this.store.get(s => s.scene);


    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;
      this.controller = next.controller;
    }));

    this.subs.add(this.xr.triggerstart.subscribe(next => {
      if (this.drag) {
        if (this.todrag.length == 0) {
          console.warn('Drag directive todrag is empty');
        }

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

          scene.attach(this.dragging);

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

    return raycaster.intersectObjects(this.todrag, this.recursive);
  }

  private PointerIntersect: any;
  private PointerIntersectObject: any;

  private unhighlight() {
    if (this.PointerIntersectObject) {
      this.PointerIntersectObject = undefined;
    }
  }

  private tick() {
    if (this.todrag.length>0 && this.controller) {

      const intersects = this.getPointerIntersections();

      if (intersects.length > 0) {
        if (this.PointerIntersectObject != intersects[0].object) {

          this.PointerIntersect = intersects[0];
          this.PointerIntersectObject = this.PointerIntersect.object;
        }
      } else {
        this.unhighlight();
      }
    }
  }
}
