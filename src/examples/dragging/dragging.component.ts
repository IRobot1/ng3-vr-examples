import { Component, OnInit } from "@angular/core";

import { Color, Euler, Vector3 } from "three";


class RandomSettings {
  constructor(public shapename: string, public color: string, public position: Vector3, public rotation: Euler, public scale: Vector3) { }
}


@Component({
  templateUrl: './dragging.component.html',
})
export class DraggingExample implements OnInit {
  x = -Math.PI / 2;
  shapes: Array<RandomSettings> = [];

  private geometries = [
    'box',
    'cone',
    'cylinder',
    'icosahedron',
    'torus'
  ];

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
}
