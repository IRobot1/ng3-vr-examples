import { Shape } from "three";

import { DrawShape } from "./draw-shape";

export class Dialog1Geometry extends DrawShape {

  drawshape(ctx: Shape, width: number, height: number, radius: number): void {
    const p1offsetx = width / 4
    const p2offsetx = width/ 4 - 0.05
    const p3offsetx = 0.05
    const p4offsetx = 0
    const p5offsetx = 0

    const p1offsety = 0
    const p2offsety = 0.05
    const p3offsety = 0.05
    const p4offsety = 0.1
    const p5offsety = 0


    this.moveTo(ctx, 0, height/2);

    // top left
    this.lineTo(ctx, width / 2 - p1offsetx , height / 2 - p1offsety)
    this.lineTo(ctx, width / 2 - p2offsetx , height / 2 - p2offsety)
    this.lineTo(ctx, width / 2 - p3offsetx , height / 2 - p3offsety)
    this.lineTo(ctx, width / 2 - p4offsetx , height / 2 - p4offsety)
    this.lineTo(ctx, width / 2 - p5offsetx , 0)

    // bottom left
    this.lineTo(ctx, width / 2 - p4offsetx, -height / 2 + p4offsety)
    this.lineTo(ctx, width / 2 - p3offsetx, -height / 2 + p3offsety)
    this.lineTo(ctx, width / 2 - p2offsetx, -height / 2 + p2offsety)
    this.lineTo(ctx, width / 2 - p1offsetx, -height / 2 + p1offsety)
    this.lineTo(ctx, 0, -height/2)

    // bottom right
    this.lineTo(ctx, -width / 2 + p1offsetx, -height / 2 + p1offsety)
    this.lineTo(ctx, -width / 2 + p2offsetx, -height / 2 + p2offsety)
    this.lineTo(ctx, -width / 2 + p3offsetx, -height / 2 + p3offsety)
    this.lineTo(ctx, -width / 2 + p4offsetx, -height / 2 + p4offsety)
    this.lineTo(ctx, -width / 2, 0)

    // top right
    this.lineTo(ctx, -width / 2 + p4offsetx, height / 2 - p4offsety)
    this.lineTo(ctx, -width / 2 + p3offsetx, height / 2 - p3offsety)
    this.lineTo(ctx, -width / 2 + p2offsetx, height / 2 - p2offsety)
    this.lineTo(ctx, -width / 2 + p1offsetx, height / 2 - p1offsety)
    
  }
}
