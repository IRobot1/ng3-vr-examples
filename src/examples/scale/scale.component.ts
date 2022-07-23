import { Component } from "@angular/core";

import { Group } from "three";

//
// Model: Littlest Tokyo by https://artstation.com/glenatron
//

@Component({
  templateUrl: './scale.component.html'
})
export class ScaleExample {
  scene!: Group;

  startscale = 0.004;
  size = this.startscale;

  private factor = 0.2;

  loaded() {
    this.scene.scale.setScalar(this.size);
    this.scene.position.y = this.factor * this.size / 0.001
  }

  start() {
    this.startscale = this.size;
  }

  scaled(scale: number) {
    this.size = this.startscale * scale;
    this.scene.scale.setScalar(this.size);
    this.scene.position.y = this.factor * this.size / 0.001
  }

}
