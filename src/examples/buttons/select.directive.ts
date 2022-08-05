import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";

import { Group, Matrix4, Object3D, Raycaster } from "three";
import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { VRControllerComponent } from "ng3-webxr";

@Directive({
  selector: '[select]',
  exportAs: 'select'
})
export class SelectDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get select(): boolean { return coerceBooleanProperty(this._enabled) }
  set select(newvalue: BooleanInput) {
    this._enabled = newvalue;
    if (!newvalue) this.unhighlight();
  }
  @Input() selectable: Array<Object3D> = [];

  @Output() selected = new EventEmitter<Object3D>();
  @Output() selectHighlight = new EventEmitter<Object3D>();
  @Output() selectUnhighlight = new EventEmitter<Object3D>();

  private controller!: Group;

  private subs = new Subscription();

  constructor(
    private xr: VRControllerComponent,
  ) { }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    let handedness: XRHandedness;

    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;
      this.controller = next.controller;

      handedness = next.xrinput.handedness;
    }));


    this.subs.add(this.xr.trigger.subscribe(next => {
      if (this.select) {
        if (this.selectable.length == 0) {
          console.warn(`${handedness} controller 'select' directive '@Input() selectable' list is empty. Nothing can be selected`);
        }

        if (this.PointerIntersectObject) {
          this.selected.next(this.PointerIntersectObject);
        }
      }
    }));

    this.subs.add(this.xr.beforeRender.subscribe(next => {
      if (this.select) this.tick();
    }));
  }

  private getPointerIntersections(): any {
    const tempMatrix = new Matrix4();

    tempMatrix.identity().extractRotation(this.controller.matrixWorld);

    const raycaster = new Raycaster();

    raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(this.selectable, false);
  }

  private PointerIntersect: any;
  private PointerIntersectObject?: Object3D;

  private highlight() {
    if (this.PointerIntersectObject) {
      this.selectHighlight.next(this.PointerIntersectObject)
    }
  }

  private unhighlight() {
    if (this.PointerIntersectObject) {
      this.selectUnhighlight.next(this.PointerIntersectObject)
      this.PointerIntersectObject = undefined;
    }
  }

  private tick() {
    if (this.controller) {

      const intersects = this.getPointerIntersections();

      if (intersects.length > 0) {
        if (this.PointerIntersectObject != intersects[0].object) {

          this.unhighlight();

          this.PointerIntersect = intersects[0];
          this.PointerIntersectObject = this.PointerIntersect.object;

          this.highlight();
        }
      }
      else {
        this.unhighlight();
      }
    }
  }

}
