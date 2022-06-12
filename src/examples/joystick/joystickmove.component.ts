import { Directive, OnInit } from "@angular/core";

import { Vector3, WebXRManager } from "three";

import { XRControllerComponent } from "../teleport/xr-controller/xr-controller.component";



@Directive({
  selector: '[joystickmove]',
})
export class JoystickhMoveDirective implements OnInit {

  private baseReferenceSpace?: XRReferenceSpace | null;

  private position = new Vector3();

  private speedfactor = 50;
  private speed = 1 / this.speedfactor;

  constructor(
    private xr: XRControllerComponent,
  ) {
  }

  ngOnInit(): void {
    let manager!: WebXRManager;

    this.xr.sessionstart.subscribe(xrmanager => {
      this.baseReferenceSpace = xrmanager.getReferenceSpace();
      manager = xrmanager;
    });

    this.xr.trigger.subscribe(next => {
      this.speed += 1 / this.speedfactor;
    });

    this.xr.grip.subscribe(next => {
      this.speed -= 1 / this.speedfactor;
      if (this.speed <= 0) {
        this.speed = 1 / this.speedfactor;
      }
    });

    this.xr.joystick.subscribe(next => {
      this.position.x += next.x * this.speed;
      this.position.y += next.y * this.speed;

      const offsetPosition = <DOMPointReadOnly>{ x: -this.position.x, z: -this.position.y, y: 0, w: 1 };
      const offsetRotation = <DOMPointReadOnly>{ x: 0, y: 0, z: 0, w: 1 };
      const transform = new XRRigidTransform(offsetPosition, offsetRotation);
      if (this.baseReferenceSpace) {
        const teleportSpaceOffset = this.baseReferenceSpace.getOffsetReferenceSpace(transform);
        manager.setReferenceSpace(teleportSpaceOffset);
      }
    });
  }
}
