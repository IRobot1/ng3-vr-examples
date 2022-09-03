import { Component, Input, OnInit } from "@angular/core";

import { Group, MathUtils } from "three";
import { NgtTriple } from "@angular-three/core";

class HelixPairData {
  constructor(public height: number, public angle: number, public leftcolor: string, public rightcolor: string) { }
}

@Component({
  selector: 'double-helix',
  templateUrl: './double-helix.component.html',
})
export class DoubleHelixComponent implements OnInit {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  @Input() height = 1;
  @Input() animate = false;

  pairs: Array<HelixPairData> = [];
  group!: Group;

  ngOnInit(): void {
    const turns = 9; // per unit
    const angle = MathUtils.degToRad(180 / turns);

    const delta = 1 / turns

    let leftcolor = 'red';
    let rightcolor = 'orange';

    for (let i = 0; i * delta <= this.height; i++) {
      if (Math.random() > 0.5) {
        leftcolor = 'red';
        rightcolor = 'orange';
      }
      else {
        leftcolor = 'blue';
        rightcolor = 'green';
      }
      this.pairs.push(new HelixPairData(-this.height / 2 + i * delta, angle * i, leftcolor, rightcolor))
    }
  }


  tick() {
    if (this.animate) {
      this.group.rotation.y += 0.005;
    }
  }
}
