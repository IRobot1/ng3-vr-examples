import { Component } from "@angular/core";

import { Object3D } from "three";

import { NgtTriple } from "@angular-three/core";

import { GenerateRandomShapes } from "../dragging/dragging.component";

class BehaviorSetting {
  constructor(public position: NgtTriple, public rotation: number, public text: string, public left = false,  public right = false) { }
}

@Component({
  templateUrl: './behaviors.component.html',
})
export class BehaviorsExample {

  examples = [
    { text: 'Show Controller', enabled: true },
    { text: 'Tracking Pointer', enabled: true },
    { text: 'Highlight Object', enabled: true },
    { text: 'Teleport', enabled: false },
    { text: 'Drag Shapes', enabled: false },
    //{ text: 'Hand Input', enabled: false },
    //{ text: 'Show Hand', enabled: false },
  ]

  options: Array<BehaviorSetting> = [];
  offset = -2;

  constructor() {
    const angle = 360 / this.examples.length;

    this.examples.forEach((item, index) => {
      const position = [0, 0, 0] as NgtTriple;
      const rotation = angle * index;

      const behavior = new BehaviorSetting(position, rotation, item.text, item.enabled, item.enabled)
      this.options.push(behavior);
    })
  }

  shapes = new GenerateRandomShapes().generate(10);
  todrag: Array<Object3D> = [];

  tohighlight: Array<Object3D> = [];
  highlighted?: Object3D;

  toggleleft() {
    if (this.highlighted) {
      const option: BehaviorSetting = this.highlighted.userData['option'];
      if (option) {
        option.left = !option.left;

        // automatically reenable after delay
        if (option.text == 'Highlight Object') {
          const timer = setTimeout(() => {
            option.left = true;
            clearTimeout(timer);
          }, 2000)
        }
      }
    }
  }

  toggleright() {
    if (this.highlighted) {
      const option: BehaviorSetting = this.highlighted.userData['option'];
      if (option) {
        option.right = !option.right;

        // automatically reenable after delay
        if (option.text == 'Highlight Object') {
          const timer = setTimeout(() => {
            option.right = true;
            clearTimeout(timer);
          }, 2000)
        }
      }
    }
  }

}
