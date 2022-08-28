import { Component } from "@angular/core";

import { CatmullRomCurve3, Mesh, TubeGeometry, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

@Component({
  selector: 'spiro-mesh',
  templateUrl: './spiro-mesh.component.html'
})
export class SpiroMeshComponent extends NgtObjectProps<Mesh> {

  inst!: Mesh;
  refresh(vectors: Array<Vector3>, close: boolean = false) {
    this.inst.geometry.dispose();
    const curve = new CatmullRomCurve3(vectors, close);
    this.inst.geometry = new TubeGeometry(curve, vectors.length, 0.01);

  }
}
