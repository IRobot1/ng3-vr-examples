import { Shape } from "three";

import { DrawShape } from "./draw-shape";

export class RoundRectangeGeometry extends DrawShape {

  drawshape(ctx: Shape, width: number, height: number, radius: number): void {
    this.moveTo(ctx, -width / 2, - height / 2 + radius);
    this.lineTo(ctx, -width / 2, height / 2 - radius);
    this.quadraticCurveTo(ctx, -width / 2, height / 2, -width / 2 + radius, height / 2);
    this.lineTo(ctx, width / 2 - radius, height / 2);
    this.quadraticCurveTo(ctx, width / 2, height / 2, width / 2, height / 2 - radius);
    this.lineTo(ctx, width / 2, -height / 2 + radius);
    this.quadraticCurveTo(ctx, width / 2, -height / 2, width / 2 - radius, -height / 2);
    this.lineTo(ctx, -width / 2 + radius, -height / 2);
    this.quadraticCurveTo(ctx, -width / 2, -height / 2, -width / 2, -height / 2 + radius);
  }
}
