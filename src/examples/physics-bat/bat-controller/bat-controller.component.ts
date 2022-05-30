import { Component, Input, OnInit } from "@angular/core";

import { Group, Mesh, Vector3 } from "three";

import { NgtTriple, NgtVector3 } from "@angular-three/core";
import { NgtStore } from "@angular-three/core";

import { NgtPhysicBody } from "@angular-three/cannon";

import { NgtGLTFLoader } from '@angular-three/soba/loaders';

import { XRControllerModelFactory } from "three-stdlib/webxr/XRControllerModelFactory";


@Component({
  selector: 'bat-controller',
  templateUrl: './bat-controller.component.html',
  providers: [NgtPhysicBody],
})
export class BatController implements OnInit {
  @Input() index = 0;
  @Input() showcontroller = false;

  @Input() position = [0, 0, 0] as NgtVector3;
  @Input() scale = [0.2, 0.2, 0.1] as NgtVector3;

  private controller!: Group;

  mesh!: Mesh;

  constructor(
    private physicBody: NgtPhysicBody,
    private store: NgtStore,
    private loader: NgtGLTFLoader,
  ) { }

  ngOnInit(): void {
    const s = this.loader.load('assets/bat.gltf').subscribe(next => {
      this.mesh = <Mesh>next.scene.children[0].children[0];

      this.mesh.geometry.computeBoundingBox();
      console.warn(this.mesh)
    },
      () => { },
      () => { s.unsubscribe(); }
    );

    const renderer = this.store.get((s) => s.gl);
    const scene = this.store.get((s) => s.scene);

    this.controller = renderer.xr.getController(this.index);
    if (this.showcontroller) {
      scene.add(this.controller);

      // The XRControllerModelFactory will automatically fetch controller models
      // that match what the user is holding as closely as possible. The models
      // should be attached to the object returned from getControllerGrip in
      // order to match the orientation of the held device.
      const controllerModelFactory = new XRControllerModelFactory();

      const controllerGrip = renderer.xr.getControllerGrip(this.index);
      controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));
      scene.add(controllerGrip);
    }
  }

  bat = this.physicBody.useCompoundBody(() => ({
    shapes: [{
      type: 'Cylinder',
      args: [0.035, 0.035, 0.55],
      position: [0, 0, -0.2],
      rotation: [ 1.57, 0, 0]
    }]
  }));

  animate() {
    const p = this.controller.position;

    this.bat.api.position.set(p.x, p.y, p.z);

    const r = this.controller.rotation;
    this.bat.api.rotation.set(r.x, r.y, r.z);
  }
}
