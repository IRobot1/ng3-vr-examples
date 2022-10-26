import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Vector3, WebXRManager } from "three";

import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { VRControllerComponent } from "ng3-webxr";




@Directive({
  selector: '[touchmove]',
})
export class TouchMoveDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get touchmove(): boolean { return coerceBooleanProperty(this._enabled) }
  set touchmove(newvalue: BooleanInput) {
    this._enabled = newvalue;
  }

  private baseReferenceSpace?: XRReferenceSpace | null;

  private position = new Vector3();

  private speedfactor = 50;
  private speed = 1 / this.speedfactor;

  private subs = new Subscription();

  constructor(
    private xr: VRControllerComponent,
  ) {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    let manager!: WebXRManager;

    this.subs.add(this.xr.sessionstart.subscribe(xrmanager => {
      if (!xrmanager) return;
      this.baseReferenceSpace = xrmanager.getReferenceSpace();
      manager = xrmanager;
    }));

    this.subs.add(this.xr.trigger.subscribe(next => {
      if (this.touchmove) {
        this.speed += 1 / this.speedfactor;
      }
    }));

    this.subs.add(this.xr.grip.subscribe(next => {
      if (this.touchmove) {
        this.speed -= 1 / this.speedfactor;
        if (this.speed <= 0) {
          this.speed = 1 / this.speedfactor;
        }
      }
    }));

    this.subs.add(this.xr.touchpadaxis.subscribe(next => {
      if (this.touchmove) {
        this.position.x += next.axis.x * this.speed;
        this.position.y += next.axis.y * this.speed;

        const offsetPosition = <DOMPointReadOnly>{ x: -this.position.x, z: -this.position.y, y: 0, w: 1 };
        const offsetRotation = <DOMPointReadOnly>{ x: 0, y: 0, z: 0, w: 1 };
        const transform = new XRRigidTransform(offsetPosition, offsetRotation);
        if (this.baseReferenceSpace) {
          const teleportSpaceOffset = this.baseReferenceSpace.getOffsetReferenceSpace(transform);
          manager.setReferenceSpace(teleportSpaceOffset);
        }
      }
    }));
  }
}
