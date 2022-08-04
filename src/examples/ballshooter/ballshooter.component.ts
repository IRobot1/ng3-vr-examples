import { Component, NgZone, OnInit } from "@angular/core";

import { Color, Group, MathUtils, Object3D, Vector3 } from 'three';

import { NgtRenderState } from "@angular-three/core";
import { gun, shoot } from "../hand/gestures";


class RandomSettings {
  constructor(public color: string, public position: Vector3, public velocity: Vector3) { }
}


@Component({
  templateUrl: './ballshooter.component.html',
})
export class BallshooterExample implements OnInit {
  radius = 0.08;

  shapes: Array<RandomSettings> = [];

  shootgestures: Array<{ name: string, vectors: Array<number> }> = [
    { name: 'gun', vectors: gun },
    { name: 'shoot', vectors: shoot },
  ]

  ngOnInit(): void {
    const timer = setInterval(() => {
      for (let i = 0; i < 10; i++) {
        this.shapes.push(new RandomSettings(
          '#' + new Color(Math.random() * 0xffffff).getHexString(),
          new Vector3(Math.random() * 4 - 2, Math.random() * 4, Math.random() * 4 - 2),
          new Vector3(Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005),
        ));
      }

      if (this.shapes.length >= 200) {
        clearInterval(timer);
      }
    }, 10)
  }

  tick({ delta }: NgtRenderState, object: Object3D) {
    const room = <Group>object;

    const radius = this.radius;
    const range = 3 - radius;
    let normal = new Vector3();
    const relativeVelocity = new Vector3();

    for (let i = 0; i < room.children.length; i++) {

      const object = room.children[i];

      const velocity: Vector3 = object.userData["velocity"];
      object.position.x += velocity.x * delta;
      object.position.y += velocity.y * delta;
      object.position.z += velocity.z * delta;

      // keep objects inside room

      if (object.position.x < - range || object.position.x > range) {

        object.position.x = MathUtils.clamp(object.position.x, - range, range);
        velocity.x = -velocity.x;

      }

      if (object.position.y < radius || object.position.y > 6) {

        object.position.y = Math.max(object.position.y, radius);

        velocity.x *= 0.98;
        velocity.y = -velocity.y * 0.8;
        velocity.z *= 0.98;

      }

      if (object.position.z < - range || object.position.z > range) {

        object.position.z = MathUtils.clamp(object.position.z, - range, range);
        velocity.z = -velocity.z;

      }

      for (let j = i + 1; j < room.children.length; j++) {

        const object2 = room.children[j];

        normal.copy(object.position).sub(object2.position);

        const distance = normal.length();

        if (distance < 2 * radius) {

          normal.multiplyScalar(0.5 * distance - radius);

          object.position.sub(normal);
          object2.position.add(normal);

          normal.normalize();

          relativeVelocity.copy(velocity).sub(object2.userData["velocity"]);

          normal = normal.multiplyScalar(relativeVelocity.dot(normal));

          velocity.sub(normal);
          object2.userData["velocity"].add(normal);

        }

      }

      velocity.y -= 9.8 * delta;
    }
  }
}
