import { Component, Input, OnInit } from "@angular/core";

import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Group, Line, LineBasicMaterial, Matrix4, Mesh, MeshBasicMaterial, Raycaster, RingGeometry, XRInputSource, XRReferenceSpace, XRRigidTransform } from "three";

import { NgtStore } from "@angular-three/core";

import { XRControllerModelFactory } from "three-stdlib/webxr/XRControllerModelFactory";


declare var RigidTransformXR: any;


@Component({
  selector: 'teleport-controller',
  templateUrl: './teleport-controller.component.html',
})
export class TeleportControllerComponent implements OnInit {
  @Input() marker!: Mesh;
  @Input() floor!: Mesh;
  @Input() index = 0;

  private controller!: Group;

  private baseReferenceSpace?: XRReferenceSpace | null;

  constructor(private store: NgtStore) { }

  ngOnInit(): void {
    const renderer = this.store.get((s) => s.gl);

    renderer.xr.addEventListener('sessionstart', () => this.baseReferenceSpace = renderer.xr.getReferenceSpace())

    const scene = this.store.get((s) => s.scene);

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

    this.controller.addEventListener('selectstart', () => {
      this.controller.userData["isSelecting"] = true;
    });
    this.controller.addEventListener('selectend', () => {
      this.controller.userData["isSelecting"] = false;
      this.teleport(renderer);
    });

    this.controller.addEventListener('connected', (event) => {
      const source = <XRInputSource>event.target;
      this.controller.name = source.handedness;
      if (source.targetRayMode == 'tracked-pointer') {
        this.controller.add(this.buildTrackPointer());
      }
      else if (source.targetRayMode == 'gaze') {
        this.controller.add(this.buildGaze());
      }
    });
    this.controller.addEventListener('disconnected', () => {
      this.controller.remove(this.controller.children[0]);
    });

  }

  private buildTrackPointer() {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
    geometry.setAttribute('color', new Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

    const material = new LineBasicMaterial({ vertexColors: true, blending: AdditiveBlending });

    return new Line(geometry, material);
  }

  private buildGaze() {
    const geometry = new RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
    const material = new MeshBasicMaterial({ opacity: 0.5, transparent: true });
    return new Mesh(geometry, material);
  }

  teleport(renderer: any) {
    if (this.MarkerIntersection) {
      const offsetPosition = <DOMPointReadOnly>{ x: - this.MarkerIntersection.x, y: - this.MarkerIntersection.y, z: - this.MarkerIntersection.z, w: 1 };
      const offsetRotation = <DOMPointReadOnly>{ x: 0, y: 0, z: 0, w: 1 };
      const transform = new RigidTransformXR(offsetPosition, offsetRotation);
      if (this.baseReferenceSpace) {
        const teleportSpaceOffset = this.baseReferenceSpace.getOffsetReferenceSpace(transform);
        renderer.xr.setReferenceSpace(teleportSpaceOffset);
      } 

    }
  }

  private MarkerIntersection: any;

  animateGroup() {
    this.MarkerIntersection = undefined;

    if (this.controller.userData["isSelecting"] === true) {

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
