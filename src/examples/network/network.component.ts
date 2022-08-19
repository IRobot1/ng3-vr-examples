import { Component } from "@angular/core";
import { BufferGeometry, Object3D, Vector3 } from "three";


@Component({
  templateUrl: './network.component.html',
})
export class NetworkExample {
  positions = new Float32Array([
    -1, 1, -1,
    1, 1, -1
  ]);


  y = 1;

  ready(buffer: BufferGeometry) {
    const points = [
      new Vector3(-1, 0, 0),
      new Vector3(1, 0, 0)
    ];

    buffer.setFromPoints(points);
  }

  tick(group: Object3D) {
    group.rotation.y += 0.01;
  }
}
