import { Component } from "@angular/core";

import { Mesh, MeshStandardMaterial, Object3D } from "three";
import { NgtTriple } from "@angular-three/core";

import { CameraService } from "../../app/camera.service";

@Component({
  templateUrl: './buttons.component.html',
})
export class ButtonsExample {
  lookat: NgtTriple = [0, 1, -1.5];

  selectable: Array<Object3D> = [];

  torus!: Mesh;

  constructor(
    private cameraService: CameraService,
  ) {
    this.cameraService.position = [0, 1.5, 0];
    this.cameraService.lookAt = [0, 0, -2.5];
    this.cameraService.fov = 65;
  }


  selected(object: any) {
    (this.torus.material as MeshStandardMaterial).color = object.material.color;
  }

  highlight(object: any) {
    object.material.emissive.b = 1;
  }
  unhighlight(object: any) {
    object.material.emissive.b = 0;
  }

  tick() {
    this.torus.rotation.y += 0.005;
  }
}
