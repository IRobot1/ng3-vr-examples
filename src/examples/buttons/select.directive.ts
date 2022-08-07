import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";

import { Group, Intersection, Matrix4, Object3D, Raycaster, Vector2 } from "three";
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

  @Output() selected = new EventEmitter<Intersection>();
  @Output() selectHighlight = new EventEmitter<Intersection>();
  @Output() selectUnhighlight = new EventEmitter<Intersection>();

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

        if (this.PointerIntersect) {
          this.PointerIntersect.object.dispatchEvent({ type: 'click'});
          this.selected.next(this.PointerIntersect);
        }
      }
    }));

    this.subs.add(this.xr.beforeRender.subscribe(next => {
      if (this.select) this.tick();
    }));
  }

  private getPointerIntersections(): Array<Intersection> {
    const tempMatrix = new Matrix4();

    tempMatrix.identity().extractRotation(this.controller.matrixWorld);

    const raycaster = new Raycaster();

    raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(this.selectable, false);
  }

  private PointerIntersect?: Intersection;

  private highlight() {
    if (this.PointerIntersect) {
      this.selectHighlight.next(this.PointerIntersect)
    }
  }

  private unhighlight() {
    if (this.PointerIntersect) {
      this.selectUnhighlight.next(this.PointerIntersect)
      this.PointerIntersect = undefined;
    }
  }

  private tick() {
    if (this.controller) {

      const intersects = this.getPointerIntersections();

      if (intersects.length > 0) {
        const firstIntersect = intersects[0];
        if (this.PointerIntersect?.object != firstIntersect.object || this.PointerIntersect?.instanceId != firstIntersect.instanceId ) {

          this.unhighlight();

          this.PointerIntersect = firstIntersect;

          this.highlight();
        }
      }
      else {
        this.unhighlight();
      }
    }
  }

}
