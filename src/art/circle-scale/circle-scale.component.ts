import { NgtTriple } from "@angular-three/core";
import { Component, Input } from "@angular/core";
import { MathUtils } from "three";

class ScaleData {
  constructor(public offset: number, public angle: number, public radius: number) { }
}

@Component({
  selector: 'circle-scale',
  templateUrl: './circle-scale.component.html',
})
export class CircleScaleComponent {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  scales: Array<ScaleData> = [];
  maxradius = 0;

  constructor() {
    const sides = 24
    const rotation = MathUtils.degToRad(360 / sides);

    let radius = 0.002;
    let offset = 0.05;
    const rings = 12;

    for (let ring = 1; ring < rings; ring++) {
      offset += radius + radius * 2 * ring;

      for (let i = 0; i < sides; i++) {
        this.scales.push(new ScaleData(offset, rotation * i + ring, radius * ring));
      }

    }
    this.maxradius = offset + radius + radius * 2;
  }
}
