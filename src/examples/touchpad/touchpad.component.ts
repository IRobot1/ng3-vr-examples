import { Component } from "@angular/core";
import { ExtrudeGeometry, Shape } from "three";

@Component({
  templateUrl: './touchpad.component.html',
})
export class TouchpadExample {
  enabled = true;

  constructor() {
    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.enabled = !this.enabled }, 5000);
  }

  buildgeometry(shape: Shape) {
    return new ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false })
  }

}
