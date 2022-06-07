import { Directive, OnDestroy, OnInit } from "@angular/core";

import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Group, Line, LineBasicMaterial, Object3D, XRGripSpace } from "three";

import { XRControllerComponent } from "./xr-controller.component";

@Directive({
  selector: '[trackedpointer]',
})
export class TrackedPointerDirective implements OnInit, OnDestroy {
  private controller!: Group;

  line!: Object3D;

  constructor(
    private xr: XRControllerComponent,
  ) { }

  ngOnDestroy(): void {
    this.controller?.remove(this.line);
  }

  ngOnInit(): void {
    this.xr.connected.subscribe(next => {
      if (next.xrinput.targetRayMode == 'tracked-pointer') {
        this.line = this.buildTrackPointer();
        next.controller.add(this.line);
      }
      this.controller = next.controller
    });

    this.xr.disconnected.subscribe(next => {
      this.controller.remove(this.line)
    });
  }

  private buildTrackPointer() {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
    geometry.setAttribute('color', new Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

    const material = new LineBasicMaterial({ vertexColors: true, blending: AdditiveBlending });

    return new Line(geometry, material);
  }
}
