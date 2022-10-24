import { Component, OnInit } from "@angular/core";

import { Mesh } from "three";

import { InteractiveObjects } from "ng3-flat-ui";
import { Ng3GUI } from "ng3-gui";

@Component({
  templateUrl: './work-surface.component.html',
})
export class WorkSurfaceExample implements OnInit {
  height = 0.5
  deskwidth = 1.5
  deskdepth = 0.75

  public parameters = {
    radius: 0.6,
    tube: 0.2,
    tubularSegments: 150,
    radialSegments: 20,
    p: 2,
    q: 3
  };

  gui!: Ng3GUI;
  selectable = new InteractiveObjects();

  ngOnInit(): void {
    const gui = new Ng3GUI({ width: 300 });
    gui.add(this.parameters, 'radius', 0.1, 1.0, 0.01);
    gui.add(this.parameters, 'tube', 0.01, 1.0, 0.01);
    gui.add(this.parameters, 'tubularSegments', 10, 150, 1);
    gui.add(this.parameters, 'radialSegments', 2, 20, 1);
    gui.add(this.parameters, 'p', 1, 20, 1);
    gui.add(this.parameters, 'q', 0, 20, 1);
    this.gui = gui;
  }

  animatering(object: Mesh, delta: number) {
    object.rotation.z += delta;
  }

}
