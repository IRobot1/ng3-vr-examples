import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { AdditiveBlending, Group, Line, Mesh, MeshBasicMaterial, Quaternion, RingGeometry, XRInputSource, XRReferenceSpace } from "three";

import { NgtRenderState, NgtStore } from "@angular-three/core";

import { XRControllerModelFactory } from "three-stdlib/webxr/XRControllerModelFactory";


export type TrackType = 'pointer' | 'grab';

export class GrabStartEvent {
  constructor(public controller: Group, public grabbedobject: any, public intersect: any) { }
}

export class GrabEndEvent {
  constructor(public controller: Group) { }
}

@Component({
  selector: 'teleport-controller',
  templateUrl: './teleport-controller.component.html',
})
export class TeleportControllerComponent implements OnInit {
  @Input() index = 0;

  private controller?: Group;

  position = new Float32Array([0, 0, 0, 0, 0, - 1]);
  color = new Float32Array([0.5, 0.5, 0.5, 0, 0, 0]);
  blending = AdditiveBlending;

  trackedpointerline?: Line;
  private baseReferenceSpace?: XRReferenceSpace | null;

  constructor(private canvasStore: NgtStore) { }

  ngOnInit(): void {
    const renderer = this.canvasStore.get((s) => s.gl);

    renderer.xr.addEventListener('sessionstart', () => this.baseReferenceSpace = renderer.xr.getReferenceSpace())

    const scene = this.canvasStore.get((s) => s.scene);

    this.controller = renderer.xr.getController(this.index);
    scene.add(this.controller);

    // The XRControllerModelFactory will automatically fetch controller models
    // that match what the user is holding as closely as possible. The models
    // should be attached to the object returned from getControllerGrip in
    // order to match the orientation of the held device.
    const controllerModelFactory = new XRControllerModelFactory();

    const controllerGrip = renderer.xr.getControllerGrip(this.index);
    controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));
    scene.add(controllerGrip);

    this.controller.addEventListener('selectstart', (event) => {
      const controller = <Group>event.target;
      controller.userData["isSelecting"] = true;
    });
    this.controller.addEventListener('selectend', (event) => {
      const controller = <Group>event.target;
      controller.userData["isSelecting"] = false;
      this.teleport(renderer);
    });

    this.controller.addEventListener('connected', (event) => {
      const controller = <Group>event.target;
      const source = <XRInputSource>event.target;
      controller.name = source.handedness;
      if (source.targetRayMode == 'tracked-pointer') {
        if (this.trackedpointerline) {
          controller.add(this.trackedpointerline);
        }
      }
      else if (source.targetRayMode == 'gaze') {
        controller.add(this.buildGaze());
      }
    });
    this.controller.addEventListener('disconnected', (event) => {
      const controller = <Group>event.target;
      controller.remove(controller.children[0]);
    });

  }

  lineready(line: Line) {
    this.trackedpointerline = line;
  }

  private buildGaze() {
    const geometry = new RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
    const material = new MeshBasicMaterial({ opacity: 0.5, transparent: true });
    return new Mesh(geometry, material);
  }

  teleport(renderer: any) {
    if (this.PointerIntersect) {
      const offsetPosition = { x: - this.PointerIntersect.x, y: - this.PointerIntersect.y, z: - this.PointerIntersect.z, w: 1 };
      const offsetRotation = new Quaternion();
      //const transform = new XRRigidTransform(offsetPosition, offsetRotation);
      //if (this.baseReferenceSpace) {
      //  const teleportSpaceOffset = this.baseReferenceSpace.getOffsetReferenceSpace(transform);
      //  renderer.xr.setReferenceSpace(teleportSpaceOffset);
      //}

    }
  }

  private PointerIntersect: any;

  animateGroup(event: NgtRenderState) {
    //  const room = <Group>event.scene.getObjectByName('room');
    //  if (this.controller && room) {

    //    const intersects = this.getPointerIntersections(this.controller, room);

    //    if (intersects.length > 0) {
    //      if (this.PointerIntersectObject != intersects[0].object) {

    //        if (this.PointerIntersectObject) this.PointerIntersectObject.material.emissive.b = 0;

    //        this.PointerIntersect = intersects[0];
    //        this.PointerIntersectObject = this.PointerIntersect.object;
    //        this.PointerIntersectObject.material.emissive.b = 1;
    //      }
    //    } else {
    //      if (this.PointerIntersectObject) {
    //        this.PointerIntersectObject.material.emissive.b = 0;
    //        this.PointerIntersectObject = undefined;
    //      }

    //    }
    //  }
  }
}
