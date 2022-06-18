import { Directive, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { Group, Matrix4, Mesh, Raycaster, Vector3, WebXRManager } from "three";

import { BooleanInput, coerceBooleanProperty } from "@angular-three/core";

import { XRControllerComponent } from "./xr-controller.component";

@Directive({
  selector: '[teleport]',
})
export class TeleportDirective implements OnInit, OnDestroy {
  private _teleportEnabled: BooleanInput = true;
  @Input()
  get teleport(): boolean { return coerceBooleanProperty(this._teleportEnabled) }
  set teleport(newvalue: BooleanInput) {
    this._teleportEnabled = newvalue;
    this.hideMarker();
    this.isSelecting = false;
  }

  @Input() marker!: Mesh;
  @Input() floor!: Mesh;

  private baseReferenceSpace?: XRReferenceSpace | null;

  private controller!: Group;
  private isSelecting = false;
  private subs = new Subscription();

  constructor(
    private xr: XRControllerComponent,
  ) { }

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

    this.subs.add(this.xr.connected.subscribe(next => {
      if (!next) return;
      this.controller = next.controller
    }));

    this.subs.add(this.xr.triggerstart.subscribe(() => {
      if (this.teleport) {
        this.isSelecting = true;
      }
    }));

    this.subs.add(this.xr.triggerend.subscribe(() => {
      if (this.teleport) {
        this.isSelecting = false;
        this.teleportToMarker(manager, this.MarkerIntersection);
      }
    }));

    this.subs.add(this.xr.beforeRender.subscribe(() => {
      if (this.teleport) {
        this.tick();
      }
    }));

    this.hideMarker();
  }

  private hideMarker() {
    if (this.marker) {
      this.marker.visible = false;
    }
  }

  private MarkerIntersection?: Vector3;

  private teleportToMarker(xrmanager: WebXRManager, position?: Vector3) {
    if (position) {
      const offsetPosition = <DOMPointReadOnly>{ x: - position.x, y: - position.y, z: - position.z, w: 1 };
      const offsetRotation = <DOMPointReadOnly>{ x: 0, y: 0, z: 0, w: 1 };
      const transform = new XRRigidTransform(offsetPosition, offsetRotation);
      if (this.baseReferenceSpace) {
        const teleportSpaceOffset = this.baseReferenceSpace.getOffsetReferenceSpace(transform);
        xrmanager.setReferenceSpace(teleportSpaceOffset);
      }
    }
  }

  private tick() {
    this.MarkerIntersection = undefined;

    if (this.isSelecting) {

      const tempMatrix = new Matrix4();
      tempMatrix.identity().extractRotation(this.controller.matrixWorld);

      const raycaster = new Raycaster();
      raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

      const intersects = raycaster.intersectObjects([this.floor]);

      if (intersects.length > 0) {

        this.MarkerIntersection = intersects[0].point;
        this.MarkerIntersection.y = 0.01;

      }

    }

    if (this.MarkerIntersection) this.marker.position.copy(this.MarkerIntersection);

    this.marker.visible = this.MarkerIntersection !== undefined;
  }

}
