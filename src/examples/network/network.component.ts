import { Component, OnInit } from "@angular/core";

import { Camera, Group, MathUtils, Mesh, MeshStandardMaterial, Object3D } from "three";
import { NgtStore, NgtTriple } from "@angular-three/core";

import createGraph, { Graph } from "ngraph.graph";

import { CameraService } from "../../app/camera.service";

import { networkdata } from "./network-data";



@Component({
  templateUrl: './network.component.html',
})
export class NetworkExample implements OnInit {
  protected scale = [0.02, 0.02, 0.02] as NgtTriple;
  protected rotation = [0, 0, 0] as NgtTriple;

  protected list: Array<Object3D> = [];

  private camera!: Camera;

  graph!: Graph;

  stable = false;
  loading = false;

  constructor(
    private store: NgtStore,
    private cameraService: CameraService,
  ) {
    this.cameraService.position = [0, 1.5, 2];
    this.cameraService.lookAt = [0, 1.5, 0];
  }


  ngOnInit(): void {
    this.camera = this.store.get(s => s.camera);

    const g = createGraph();
    networkdata.forEach(item => {
      const from = item[0];
      const to = item[1];
      if (!g.hasNode(from)) {
        g.addNode(from);
      }
      if (!g.hasNode(to)) {
        g.addNode(to);
      }
      g.addLink(from, to);
    });
    this.graph = g;
  }

  flipAfterLoad(loading: boolean, group: Group) {
    this.loading = !loading;
    if (!this.loading) {
      group.rotation.y = MathUtils.degToRad(180);
    }
  }

  highlight(object: Object3D) {
    object.scale.multiplyScalar(2);
    ((object as Mesh).material as MeshStandardMaterial).color.setStyle('red');
    object.lookAt(this.camera.position);
  }

  unhighlight(object: Object3D) {
    object.scale.multiplyScalar(0.5);
    //((object as Mesh).material as MeshStandardMaterial).emissive.b = 1;
    ((object as Mesh).material as MeshStandardMaterial).color.setStyle('blue');
  }

  tick(group: Object3D) {
    if (this.stable)
      group.rotation.y += 0.001;
  }
}
