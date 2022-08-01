import { Component, OnDestroy } from "@angular/core";

import { Group, Mesh } from "three";
import { NgtStore } from "@angular-three/core";

import GUI from "lil-gui";

// copied from https://github.com/mrdoob/three.js/tree/master/examples/jsm/interactive until available in three-stdlib

import { HTMLMesh } from "./HTMLMesh";
import { CameraService } from "../../app/camera.service";


@Component({
  templateUrl: './htmlgui.component.html',
})
export class HTMLGUIExample implements OnDestroy {
  public parameters = {
    radius: 0.6,
    tube: 0.2,
    tubularSegments: 150,
    radialSegments: 20,
    p: 2,
    q: 3
  };

  group = new Group();

  private mesh!: HTMLMesh;

  constructor(
    private store: NgtStore,
    private camera: CameraService,
  ) {
    this.camera.position = [0, 1, 0];
    this.camera.lookAt = [-1, 1, -3];

    const gui = new GUI({ width: 300 });
    gui.add(this.parameters, 'radius', 0.0, 1.0);
    gui.add(this.parameters, 'tube', 0.0, 1.0);
    gui.add(this.parameters, 'tubularSegments', 10, 150, 1);
    gui.add(this.parameters, 'radialSegments', 2, 20, 1);
    gui.add(this.parameters, 'p', 1, 10, 1);
    gui.add(this.parameters, 'q', 0, 10, 1);
    gui.domElement.style.visibility = 'hidden';

    const mesh = new HTMLMesh(gui.domElement);
    mesh.position.x = - 0.75;
    mesh.position.y = 1;
    mesh.position.z = - 1;
    mesh.rotation.y = Math.PI / 4;
    mesh.scale.setScalar(2);

    const scene = this.store.get(s => s.scene);
    scene.add(this.group);

    this.group.add(mesh);

    this.mesh = mesh;
  }

  ngOnDestroy(): void {
    const scene = this.store.get(s => s.scene);
    scene.remove(this.group);
    this.mesh.dispose();
  }

  tick(torus: Mesh) {
    torus.rotation.y += 0.005;
  }
}
