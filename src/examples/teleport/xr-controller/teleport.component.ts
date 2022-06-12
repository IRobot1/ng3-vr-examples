import { Directive, Input } from "@angular/core";

import { Group, Matrix4, Mesh, Raycaster, Vector3, WebXRManager } from "three";

import { XRControllerComponent } from "./xr-controller.component";

@Directive({
  selector: '[teleport]',
})
export class TeleportDirective {
  @Input() marker!: Mesh;
  @Input() floor!: Mesh;

  private baseReferenceSpace?: XRReferenceSpace | null;

  private controller!: Group;
  private isSelecting = false;

  constructor(
    private xr: XRControllerComponent,
  ) {
    let manager!: WebXRManager;
    this.xr.sessionstart.subscribe(xrmanager => {
      this.baseReferenceSpace = xrmanager.getReferenceSpace();
      manager = xrmanager;
    });

    this.xr.connected.subscribe(next => {
      this.controller = next.controller
    });

    this.xr.selectstart.subscribe(xrinput => {
      this.isSelecting = true;
    });

    this.xr.selectend.subscribe(next => {
      this.isSelecting = false;
      this.teleport(manager, this.MarkerIntersection);
    });

    this.xr.beforeRender.subscribe(next => {
      this.tick();
    })
  }

  private MarkerIntersection?: Vector3;

  private teleport(xrmanager: WebXRManager, position?: Vector3) {
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

      }

    }

    if (this.MarkerIntersection) this.marker.position.copy(this.MarkerIntersection);

    this.marker.visible = this.MarkerIntersection !== undefined;
  }

}
