import { Shape } from "three";

import { DrawShape } from "./draw-shape";

export class Button1Geometry extends DrawShape {

  drawshape(ctx: Shape, width: number, height: number, radius: number): void {
    const offset = 0.25 * width / 2

    this.moveTo(ctx, 0, height / 2);

    // top left
    this.lineTo(ctx, width / 2, height / 2)
    this.lineTo(ctx, width / 2, 0)

    // bottom left
    this.lineTo(ctx, width / 2, -height / 2 + offset)
    this.lineTo(ctx, width / 2 - offset, -height / 2)
    this.lineTo(ctx, 0, -height / 2)

    // bottom right
    this.lineTo(ctx, -width / 2, -height / 2)
    this.lineTo(ctx, -width / 2, 0)

    // top left
    this.lineTo(ctx, -width / 2, height / 2 - offset)
    this.lineTo(ctx, -width / 2 + offset, height / 2)
  }
}
