import { Shape } from "three";

import { DrawShape } from "./draw-shape";

export class Label2Geometry extends DrawShape {

  drawshape(ctx: Shape, width: number, height: number, radius: number): void {
    const p1cp1x = 0.08
    const p1cp2x = 0.17
    const hoffset1 = 0.27
    const p2cp1y = 0.03

    const offset2 = 0.33
    const p2cp1x = 0.025

    const offset3 = hoffset1 - 0.02;
    const p3cpx = 0.11


    this.moveTo(ctx, 0, hoffset1);

    // top right
    this.bezierCurveTo(ctx, p1cp1x, hoffset1, p1cp2x, hoffset1, width / 4, offset2);
    this.bezierCurveTo(ctx, width / 4 + p2cp1x, offset2 + p2cp1y, width / 4 + p1cp1x, offset2, width / 4 + p1cp1x, offset3);
    this.bezierCurveTo(ctx, width / 2, offset3, width / 2, p3cpx, width / 2, 0);

    //bottom right
    this.bezierCurveTo(ctx, width / 2, -p3cpx, width / 2, -offset3, width / 4 + p1cp1x, -offset3);
    this.bezierCurveTo(ctx, width / 4 + p1cp1x, -offset2, width / 4 + p2cp1x, -offset2 - p2cp1y, width / 4, -offset2);
    this.bezierCurveTo(ctx, p1cp2x, -hoffset1, p1cp1x, -hoffset1, 0, -hoffset1);

    // bottom left
    this.bezierCurveTo(ctx, -p1cp1x, -hoffset1, -p1cp2x, -hoffset1, -width / 4, -offset2);
    this.bezierCurveTo(ctx, -width / 4 - p2cp1x, -offset2 - p2cp1y, -width / 4 - p1cp1x, -offset2, -width / 4 - p1cp1x, -offset3);
    this.bezierCurveTo(ctx, -width / 2, -offset3, -width / 2, -p3cpx, -width / 2, 0);

    // top left
    this.bezierCurveTo(ctx, -width / 2, p3cpx, -width / 2, offset3, -width / 4 - p1cp1x, offset3);
    this.bezierCurveTo(ctx, -width / 4 - p1cp1x, offset2, -width / 4 - p2cp1x, offset2 + p2cp1y, -width / 4, offset2);
    this.bezierCurveTo(ctx, -p1cp2x, hoffset1, -p1cp1x, hoffset1, 0, hoffset1);
  }
}
