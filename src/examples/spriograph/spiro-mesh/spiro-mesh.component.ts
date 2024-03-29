import { Component, Input } from "@angular/core";

import { CatmullRomCurve3, Mesh, TubeGeometry, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

@Component({
  selector: 'spiro-mesh',
  templateUrl: './spiro-mesh.component.html'
})
export class SpiroMeshComponent extends NgtObjectProps<Mesh> {
  @Input() tubecolor = 'white';

  inst!: Mesh;
  refresh(vectors: Array<Vector3>, radius = 0.01, close: boolean = false) {
    this.inst.geometry.dispose();
    const curve = new CatmullRomCurve3(vectors, close);
    this.inst.geometry = new TubeGeometry(curve, vectors.length, radius);

  }
}
