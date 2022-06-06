import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { AdditiveBlending, Group, Line, Matrix4, Mesh, MeshBasicMaterial, Raycaster, RingGeometry, Vector3 } from "three";

import { NgtRenderState, NgtStore } from "@angular-three/core";

import { XRControllerModelFactory } from "three-stdlib/webxr/XRControllerModelFactory";
import { XRHandModelFactory } from "three-stdlib/webxr/XRHandModelFactory";


export type TrackType = 'pointer' | 'grab';

export class GrabStartEvent {
  constructor(public controller: Group, public grabbedobject: any, public intersect: any) { }
}

export class GrabEndEvent {
  constructor(public controller: Group) { }
}

@Component({
  selector: 'dragging-controller',
  templateUrl: './dragging-controller.component.html',
})
export class DraggingControllerComponent implements OnInit {
  @Input() index = 0;
  @Input() tracktype: TrackType = 'pointer';
  @Input() usehands = false;

  @Output() grabstart = new EventEmitter<GrabStartEvent>();
  @Output() grabend = new EventEmitter<GrabEndEvent>();

  controller?: Group;
  hand?: Group;

  position = new Float32Array([0, 0, 0, 0, 0, - 1]);
  color = new Float32Array([0.5, 0.5, 0.5, 0, 0, 0]);
  //blending = AdditiveBlending;

  trackedpointerline?: Line;

  constructor(private canvasStore: NgtStore) { }

  ngOnInit(): void {
    const renderer = this.canvasStore.get((s) => s.gl);
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

    if (this.usehands) {
      const handModelFactory = new XRHandModelFactory();

      this.hand = renderer.xr.getHand(this.index);
      this.hand.add(handModelFactory.createHandModel(this.hand));
      scene.add(this.hand);

      this.hand.addEventListener('pinchstart', (event) => {
        const controller = <Group>event.target;
        const indexTip = event.target.joints['index-finger-tip'];
        const room = <Group>this.canvasStore.get((s) => s.scene).getObjectByName('room');
        const IntersectObject = this.getHandIntersection(indexTip, room);
        this.grabstart.emit(new GrabStartEvent(controller, IntersectObject, indexTip));
        controller.userData["isSelecting"] = true;
      });
      this.hand.addEventListener('pinchend', (event) => {
        const controller = <Group>event.target;
        this.grabend.emit(new GrabEndEvent(controller));
        controller.userData["isSelecting"] = false;
      });
    }

    this.controller.addEventListener('selectstart', (event) => {
      const controller = <Group>event.target;
      if (this.tracktype == 'pointer') {
        controller.userData["isSelecting"] = true;
      }
      else if (this.tracktype == 'grab') {
        this.grabstart.emit(new GrabStartEvent(controller, this.PointerIntersectObject, this.PointerIntersect));
      }
    });
    this.controller.addEventListener('selectend', (event) => {
      const controller = <Group>event.target;
      if (this.tracktype == 'pointer') {
        controller.userData["isSelecting"] = false;
      }
      else if (this.tracktype == 'grab') {
        this.grabend.emit(new GrabEndEvent(controller));
      }
    });
    this.controller.addEventListener('connected', (event) => {
      const controller = <Group>event.target;
      const source = <XRInputSource>event.target;
      controller.name = source.handedness;
      if (this.hand) this.hand.name = source.handedness;
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
    line.name = 'line';
    line.scale.z = 1.5;
    this.trackedpointerline = line;
  }

  private buildGaze() {
    const geometry = new RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
    const material = new MeshBasicMaterial({ opacity: 0.5, transparent: true });
    return new Mesh(geometry, material);
  }

  private getPointerIntersections(controller: Group, room: Group): any {
    const tempMatrix = new Matrix4();

    tempMatrix.identity().extractRotation(controller.matrixWorld);

    const raycaster = new Raycaster();

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(room.children, false);
  }

  private getHandIntersection(indexTip: any, room: Group): Mesh | undefined {
    const tmpVector1 = new Vector3();
    const tmpVector2 = new Vector3();

    for (let i = 0; i < room.children.length; i++) {
      const child = <Mesh>room.children[i];
      const distance = indexTip.getWorldPosition(tmpVector1).distanceTo(child.getWorldPosition(tmpVector2));

      if (child.geometry.boundingSphere) {
        if (distance < child.geometry.boundingSphere.radius * child.scale.x) {
          return child;
        }
      }
    }
    return undefined;
  }

  private PointerIntersect: any;
  private PointerIntersectObject: any;

  tick(event: NgtRenderState) {
    const room = <Group>event.scene.getObjectByName('room');
    if (this.controller && room) {

      const intersects = this.getPointerIntersections(this.controller, room);

      if (intersects.length > 0) {
        if (this.PointerIntersectObject != intersects[0].object) {

          if (this.PointerIntersectObject) this.PointerIntersectObject.material.emissive.b = 0;

          this.PointerIntersect = intersects[0];
          this.PointerIntersectObject = this.PointerIntersect.object;
          this.PointerIntersectObject.material.emissive.b = 1;
        }
      } else {
        if (this.PointerIntersectObject) {
          this.PointerIntersectObject.material.emissive.b = 0;
          this.PointerIntersectObject = undefined;
        }

      }
    }
  }
}
