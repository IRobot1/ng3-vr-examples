import { make, NgtStore, NgtTriple } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { Camera, MathUtils, Object3D, Vector3 } from "three";

@Component({
  templateUrl: './network.component.html',
})
export class NetworkExample implements OnInit {
  start = [-1, 1 , -1] as NgtTriple;
  end = [1, 1, -1] as NgtTriple;
  length = 2;

  positions = new Float32Array([
    -1, 1, -1,
    1, 1, -1
  ]);

  y = 1;

  camera!: Camera;

  constructor(private store: NgtStore) { }

  ngOnInit(): void {
    this.camera = this.store.get(s => s.camera);

    this.length = make(Vector3, this.end).sub(make(Vector3, this.start)).length();
  }

  childlookat(mesh: Object3D) {
    mesh.lookAt(...this.start)
    mesh.rotateX(MathUtils.degToRad(90))
  }
}
