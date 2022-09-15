import { Component } from "@angular/core";

import { Mesh, AudioListener, PositionalAudio, AudioLoader } from "three";
import { NgtStore, NgtTriple } from "@angular-three/core";

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

  spheresound!: PositionalAudio;
  boxsound!: PositionalAudio;

  constructor(private store: NgtStore) {
    const camera = this.store.get(s => s.camera);
    const listener = new AudioListener();
    camera.add(listener);

    // create the PositionalAudio object (passing in the listener)
    this.spheresound = new PositionalAudio(listener);
    this.boxsound = new PositionalAudio(listener);

    // load a sound and set it as the PositionalAudio object's buffer
    const audioLoader = new AudioLoader();
    audioLoader.load('assets/sphere-pop.wav', (buffer) => {
      this.spheresound.setBuffer(buffer);
      this.spheresound.setRefDistance(1);
    });
    audioLoader.load('assets/box-pop.wav', (buffer) => {
      this.boxsound.setBuffer(buffer);
      this.boxsound.setRefDistance(1);
    });

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
    mesh.add(this.spheresound);
  }

  addBox(mesh: Mesh) {
    this.boxcolliders.addCollider(mesh);
    mesh.add(this.boxsound);
  }

  popSphere(mesh: Mesh) {
    this.spheresound.play();
    this.spherecolliders.removeCollider(mesh);
    mesh.parent?.remove(mesh);
  }

  popBox(mesh: Mesh) {
    this.boxsound.play();
    this.spherecolliders.removeCollider(mesh);
    mesh.parent?.remove(mesh);
  }
}
