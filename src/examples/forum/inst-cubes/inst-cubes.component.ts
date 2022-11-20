import { Component, OnInit } from "@angular/core";
import { InstancedMesh, Matrix4, Vector3 } from "three";

//
// spawn outside a central area
// https://discourse.threejs.org/t/box3-bounding-box/44925/3
//

@Component({
  templateUrl: './inst-cubes.component.html',
})
export class InstCubesExample  {
  count = 200;
  rMin = 1
  rMax = 2.5

  foxsize = this.rMin / 2;

  scale = new Vector3(0.5, 0.5, 0.5)

  dummies = new Array(this.count).fill(0).map(() => {

    let angle = -((Math.random() * 360) * Math.PI) / 180;
    let radius = this.rMin + Math.random() * this.rMax;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    return { position: new Vector3(x, 0, z), scale: this.scale }
  });

  instready(inst: InstancedMesh) {
    this.dummies.forEach((item, index) => {
      const matrix = new Matrix4();
      matrix.setPosition(item.position);
      matrix.scale(item.scale);
      inst.setMatrixAt(index, matrix);
    })
  }
}
