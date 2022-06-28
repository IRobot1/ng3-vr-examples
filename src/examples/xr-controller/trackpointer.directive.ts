import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Group, Line, LineBasicMaterial, Object3D } from "three";

import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { VRControllerComponent } from "./vr-controller.component";

@Directive({
  selector: '[trackedpointer]',
})
export class TrackedPointerDirective implements OnInit, OnDestroy {
  private _enabled: BooleanInput = true;
  @Input()
  get trackedpointer(): boolean { return coerceBooleanProperty(this._enabled) }
  set trackedpointer(newvalue: BooleanInput) {
    this._enabled = newvalue;
    if (this.line) {
      if (newvalue)
        this.show();
      else
        this.hide();
    }
  }

  line!: Object3D;

  private controller!: Group;
  private subs = new Subscription();

  constructor(
    private xr: VRControllerComponent,
  ) { }

  ngOnDestroy(): void {
    this.controller?.remove(this.line);
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;
      this.controller = next.controller

      if (next.xrinput.targetRayMode == 'tracked-pointer') {
        this.line = this.buildTrackPointer();

        if (this.trackedpointer) this.show();
      }
    }));

    this.subs.add(this.xr.disconnected.subscribe(next => {
      if (this.trackedpointer) this.hide();
    }));
  }

  private buildTrackPointer() {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
    geometry.setAttribute('color', new Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

    const material = new LineBasicMaterial({ vertexColors: true, blending: AdditiveBlending });

    return new Line(geometry, material);
  }

  private show() {
    this.controller.add(this.line);
  }

  private hide() {
    this.controller.remove(this.line)
  }
}
