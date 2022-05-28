import { Component, OnInit, ViewChild } from "@angular/core";

import { Color, Group, MathUtils, Object3D, Vector3 } from 'three';

import { NgtRenderState } from "@angular-three/core";

import { ShootControllerComponent } from "./shoot-controller/shoot-controller.component";


class RandomSettings {
  constructor(public color: string, public position: Vector3, public velocity: Vector3) { }
}


@Component({
  templateUrl: './ballshooter.component.html',
})
export class BallshooterExample implements OnInit {
  @ViewChild('xr0') xr0?: ShootControllerComponent;
  @ViewChild('xr1') xr1?: ShootControllerComponent;

  radius = 0.08;

  shapes: Array<RandomSettings> = [];

  ngOnInit(): void {
    for (let i = 0; i < 200; i++) {
      this.shapes.push(new RandomSettings(
        '#' + new Color(Math.random() * 0xffffff).getHexString(),
        new Vector3(Math.random() * 4 - 2, Math.random() * 4, Math.random() * 4 - 2),
        new Vector3(Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005),
      ));
    }
  }

  private count = 0;

  private handleController(room: Group, controller?: Group) {
    if (controller && controller.userData["isSelecting"]) {
      const object = room.children[this.count++];

      if (object) {
        object.position.copy(controller.position);
        const velocity: Vector3 = object.userData["velocity"];
        velocity.x = (Math.random() - 0.5) * 3;
        velocity.y = (Math.random() - 0.5) * 3;
        velocity.z = (Math.random() - 9);
        velocity.applyQuaternion(controller.quaternion);
      }
      if (this.count === room.children.length) this.count = 0;
    }
  }

  animateGroup({ delta }: NgtRenderState, object: Object3D) {
    const room = <Group>object;
    if (this.xr0 ) { this.handleController(room, this.xr0.controller); }
    if (this.xr1 ) { this.handleController(room, this.xr1.controller); }

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
