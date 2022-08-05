import { Component } from "@angular/core";
import { Mesh, Object3D } from "three";

@Component({
  templateUrl: './buttons.component.html',
})
export class ButtonsExample {
  list: Array<Object3D> = [];

  tick(torus: Mesh) {
    torus.rotation.y += 0.005;
  }
}
