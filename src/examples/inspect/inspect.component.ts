import { Component, OnInit } from "@angular/core";

import { NgtTriple } from "@angular-three/core";

class RandomSettings {
  constructor(public position: NgtTriple) { }
}

@Component({
  templateUrl: './inspect.component.html',
})
export class InspectExample implements OnInit {
  cubes: Array<RandomSettings> = [];

  cubeSize = 0.2
  tableHeight = 0.5;

  enabled = true;

  ngOnInit(): void {
    for (let count = 5; count > 0; count--) {
      for (let i = 0; i < count; i++) {
        const position = [i * this.cubeSize - count / 2 * this.cubeSize, (5 - count) * this.cubeSize + this.tableHeight + 0.15, -1] as NgtTriple;
        this.cubes.push(new RandomSettings(position));
      }
    }

    // uncomment to test enable/disable at runtime
    //setInterval(() => { this.enabled = !this.enabled }, 5000);

  }
}
