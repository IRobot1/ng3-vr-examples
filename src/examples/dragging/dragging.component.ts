import { Component, OnInit, ViewChild } from "@angular/core";

import { Color, Euler, Group, Vector3 } from "three";

import { NgtStore } from "@angular-three/core";

import { DraggingControllerComponent, GrabEndEvent, GrabStartEvent } from "./dragging-controller/dragging-controller.component";


class RandomSettings {
  constructor(public shapename: string, public color: string, public position: Vector3, public rotation: Euler, public scale: Vector3) { }
}


@Component({
  selector: 'app-dragging',
  templateUrl: './dragging.component.html',
})
export class DraggingExample implements OnInit {
  @ViewChild('xr0') xr0?: DraggingControllerComponent;
  @ViewChild('xr1') xr1?: DraggingControllerComponent;

  x = -Math.PI / 2;
  shapes: Array<RandomSettings> = [];

  private geometries = [
    'box',
    'cone',
    'cylinder',
    'icosahedron',
    'torus'
  ];

  constructor(private store: NgtStore) { }

  ngOnInit(): void {
    for (let i = 0; i < 75; i++) {
      const shapename = this.geometries[Math.floor(Math.random() * this.geometries.length)];
      this.shapes.push(new RandomSettings(shapename,
        '#' + new Color(Math.random() * 0xffffff).getHexString(),
        new Vector3(Math.random() * 3 - 1.5, Math.random() * 2, Math.random() * 3 - 1.5),
        new Euler(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI),
        new Vector3(Math.random() + 0.4, Math.random() + 0.4, Math.random() + 0.4),
      ));
    }
  }

  grabstart(xr: DraggingControllerComponent, event: GrabStartEvent) {
    if (event.grabbedobject) {
      if (event.controller) {
        event.controller.attach(event.grabbedobject);
        event.controller.userData["selected"] = event.grabbedobject;
      }
      if (xr.trackedpointerline) {
        xr.trackedpointerline.scale.z = event.intersect.distance;
      }
    }
  }

  grabend(xr: DraggingControllerComponent, event: GrabEndEvent) {
    if (event.controller.userData["selected"]) {
      const object = event.controller.userData["selected"];
      object.material.emissive.b = 0;

      const room = <Group>this.store.get((s) => s.scene).getObjectByName('room');
      room.attach(object);

      event.controller.userData["selected"] = undefined;
      if (xr.trackedpointerline) {
        xr.trackedpointerline.scale.z = 1.5;
      }
    }
  }

}
