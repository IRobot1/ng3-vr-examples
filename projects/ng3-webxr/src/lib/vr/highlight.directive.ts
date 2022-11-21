import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";

import { Group, Matrix4, Object3D, Raycaster } from "three";

import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { VRControllerComponent } from "./vr-controller.component";


@Directive({
  selector: '[highlight]',
  exportAs: 'highlight',
  standalone: true,
})
export class HighlightDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get highlight(): boolean { return coerceBooleanProperty(this._enabled) }
  set highlight(newvalue: BooleanInput) {
    this._enabled = newvalue;
    this.unhighlight();
  }
  @Input() tohighlight: Array<Object3D> = [];

  @Output() highlighting = new EventEmitter<Object3D | undefined>();

  private controller!: Group;
  private subs = new Subscription();

  constructor(
    private xr: VRControllerComponent,
  ) { }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    if (!this.tohighlight) {
      console.warn('Highlight directive requires room Group to be set');
      return;
    }

    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;
      this.controller = next.controller;
    }));

    this.subs.add(this.xr.beforeRender.subscribe(next => {
      if (this.highlight) this.tick();
    }));
  }

  private getPointerIntersections(): any {
    const tempMatrix = new Matrix4();

    tempMatrix.identity().extractRotation(this.controller.matrixWorld);

    const raycaster = new Raycaster();

    raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(this.tohighlight, false);
  }

  private Intersect: any;
  private IntersectObject: any;

  private unhighlight() {
    if (this.IntersectObject) {
      this.IntersectObject.material.emissive.b = 0;
      this.IntersectObject = undefined;
      this.highlighting.next(this.IntersectObject);
    }
  }

  private tick() {
    if (this.tohighlight && this.controller) {

      const intersects = this.getPointerIntersections();

      if (intersects.length > 0) {
        if (this.IntersectObject != intersects[0].object) {

          if (this.IntersectObject) {
            this.IntersectObject.material.emissive.b = 0;
          }

          this.Intersect = intersects[0];
          this.IntersectObject = this.Intersect.object;
          this.IntersectObject.material.emissive.b = 1;
          this.highlighting.next(this.IntersectObject);
        }
      } else {
        this.unhighlight();
      }
    }
  }
}
