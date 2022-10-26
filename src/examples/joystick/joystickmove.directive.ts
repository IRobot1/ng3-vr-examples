import { Directive, Input, OnDestroy, OnInit } from "@angular/core";

import { Subscription } from "rxjs";

import { Camera, Vector3, WebXRManager } from "three";
import { BooleanInput, coerceBooleanProperty, NgtStore } from "@angular-three/core";

import { AxisEvent, VRControllerComponent } from "ng3-webxr";


@Directive({
  selector: '[joystickmove]',
})
export class JoystickhMoveDirective implements OnInit, OnDestroy {
  private _moveEnabled: BooleanInput = true;
  @Input()
  get joystickmove(): boolean { return coerceBooleanProperty(this._moveEnabled) }
  set joystickmove(newvalue: BooleanInput) {
    this._moveEnabled = newvalue;
  }

  private baseReferenceSpace?: XRReferenceSpace | null;

  private position = new Vector3();

  private speed = 4;

  private subs = new Subscription();

  private camera!: Camera;
  private manager!: WebXRManager;

  constructor(
    private xr: VRControllerComponent,
    private store: NgtStore,
  ) {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();

    this.position.set(0, 0, 0);
    this.teleport();
  }

  ngOnInit(): void {
    this.camera = this.store.get(s => s.camera);


    this.subs.add(this.xr.sessionstart.subscribe(xrmanager => {
      if (!xrmanager) return;
      this.baseReferenceSpace = xrmanager.getReferenceSpace();
      this.manager = xrmanager;
    }));

    this.subs.add(this.xr.trigger.subscribe(next => {
      if (this.joystickmove) {
        this.speed = ++this.speed % 8;
      }
    }));

    this.subs.add(this.xr.joystickaxis.subscribe((event: AxisEvent) => {
      if (this.joystickmove) {
        this.move(event);
        this.teleport();
      }
    }));
  }

  teleport() {
    const offsetPosition = <DOMPointReadOnly>{ x: -this.position.x, y: 0, z: -this.position.z, w: 1 };
    const offsetRotation = <DOMPointReadOnly>{ x: 0, y: 0, z: 0, w: 1 };
    const transform = new XRRigidTransform(offsetPosition, offsetRotation);
    if (this.baseReferenceSpace) {
      const teleportSpaceOffset = this.baseReferenceSpace.getOffsetReferenceSpace(transform);
      this.manager.setReferenceSpace(teleportSpaceOffset);
    }
  }

  private getForwardVector(): Vector3 {
    const playerDirection = new Vector3()

    this.camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();

    return playerDirection;
  }

  private playerVelocity = new Vector3();

  private move(event: AxisEvent) {
    if (event.axis.x == 0 && event.axis.y == 0) return;

    const deltaTime = event.deltaTime
    const speedDelta = deltaTime * event.axis.y * this.speed;
    this.playerVelocity.add(this.getForwardVector().multiplyScalar(speedDelta));

    let damping = Math.exp(-3 * deltaTime) - 1;

    this.playerVelocity.addScaledVector(this.playerVelocity, damping);

    const deltaPosition = this.playerVelocity.clone().multiplyScalar(deltaTime);
    this.position.sub(deltaPosition)

  }
}
