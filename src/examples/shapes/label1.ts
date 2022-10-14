import { Shape } from "three";

import { DrawShape } from "./draw-shape";

export class Label1Geometry extends DrawShape {

  constructor(track = true) {
    super(1, 1, { radius: 0.02}, track)
  }

  drawshape(ctx: Shape, width: number, height: number, parameters?: any): void {
    const radius = parameters?.radius ?? 0;

    const offset = 0.15;

    this.moveTo(ctx, 0, height/2);
    this.lineTo(ctx, width/2, height/2)
    this.quadraticCurveTo(ctx, width/2 + radius, height/2, width/2 + radius, height/2 - radius);
    this.lineTo(ctx, width/2 + radius, height/2 - offset)
    this.quadraticCurveTo(ctx, width, 0, width/2 + radius, -height/2 + offset);
    this.lineTo(ctx, width/2 + radius, -height/2 + radius)
    this.quadraticCurveTo(ctx, width/2 + radius, -height/2, width/2, -height/2);
    this.lineTo(ctx, 0, -height/2)

    this.lineTo(ctx, -width/2, -height/2)
    this.quadraticCurveTo(ctx, -width/2 - radius, -height/2, -width/2 - radius, -height/2 + radius);
    this.lineTo(ctx, -width/2 - radius, -height/2 + offset)
    this.quadraticCurveTo(ctx, -width, 0, -width/2 - radius, height/2 - offset);
    this.lineTo(ctx, -width/2 - radius, height/2 - radius)
    this.quadraticCurveTo(ctx, -width/2 - radius, height/2, -width/2, height/2);
  }
}
