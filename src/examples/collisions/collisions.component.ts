import { Component } from "@angular/core";

import { Mesh } from "three";
import { NgtTriple } from "@angular-three/core";

import { CollisionGroup } from "./collision";

class ObjectData {
  constructor(public position: NgtTriple, public rotation = 0) { }
}

@Component({
  templateUrl: './collisions.component.html',
})
export class CollisionsExample {
  spheres: Array<ObjectData> = [];
  boxes: Array<ObjectData> = [];

  spherecolliders = new CollisionGroup();
  boxcolliders = new CollisionGroup();

  volume = 1;
  get randomInVolume() { return -this.volume + Math.random() * this.volume * 2; }

  constructor() {
    const count = 50;

    for (let i = 0; i < count; i++) {
      this.spheres.push(new ObjectData(
        [this.randomInVolume, this.randomInVolume + this.volume, this.randomInVolume]
      ));
    }

    for (let i = 0; i < count; i++) {
      this.boxes.push(new ObjectData(
        [this.randomInVolume, this.randomInVolume + this.volume, this.randomInVolume],
        Math.random() * 90
      ));
    }
  }

  addSphere(mesh: Mesh) {
    this.spherecolliders.addCollider(mesh, 'sphere');
  }

  addBox(mesh: Mesh) {
    this.boxcolliders.addCollider(mesh);
  }

  popSphere(mesh: Mesh) {
    this.spherecolliders.removeCollider(mesh);
    mesh.parent?.remove(mesh);
  }

  popBox(mesh: Mesh) {
    this.spherecolliders.removeCollider(mesh);
    mesh.parent?.remove(mesh);
  }
}
