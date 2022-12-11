import { BufferGeometry, CubicBezierCurve, Mesh, QuadraticBezierCurve, SplineCurve, Vector2, Vector3 } from "three";

export class PathPoint {
  mesh!: Mesh;

  changex = true; // allow x to change
  changey = true; // allow y to change

  constructor(public position: Vector2, public color = 'white') { }
}


export type CommandType = 'moveto' | 'lineto' | 'vertical' | 'horizontal'

export abstract class BaseCommand {
  geometry?: BufferGeometry;

  line(start: Vector2, end: Vector2): BufferGeometry {
    const points: Array<Vector2> = [start, end]
    return new BufferGeometry().setFromPoints(points);
  }

  spline(points: Array<Vector2>): BufferGeometry {
    const curve = new SplineCurve(points);
    const curvepoints = curve.getPoints(25);
    return new BufferGeometry().setFromPoints(curvepoints);
  }

  quadratic(v0: Vector2, v1: Vector2, v2: Vector2): BufferGeometry {
    const curve = new QuadraticBezierCurve(v0, v1, v2);
    const curvepoints = curve.getPoints(25);
    return new BufferGeometry().setFromPoints(curvepoints);
  }

  bezier(v0: Vector2, v1: Vector2, v2: Vector2, v3: Vector2): BufferGeometry {
    const curve = new CubicBezierCurve(v0, v1, v2, v3);
    const curvepoints = curve.getPoints(25);
    return new BufferGeometry().setFromPoints(curvepoints);
  }



  constructor(public type: CommandType, public text: string, public from: PathPoint, public to: PathPoint) { this.update() }

  public update() { };
}

export class MoveToCommand extends BaseCommand {
  constructor(from: PathPoint, to: PathPoint) { super('moveto', 'M', from, to); }
}

export class LineToCommand extends BaseCommand {
  constructor(from: PathPoint, to: PathPoint) {
    super('lineto', 'L', from, to);
  }

  override update() {
    if (this.geometry) this.geometry.dispose();
    this.geometry = this.line(this.from.position, this.to.position)
  }
}

export class VerticalCommand extends BaseCommand {
  constructor(from: PathPoint, to: PathPoint) { super('vertical', 'V', from, to); }

  override update() {
    if (this.geometry) this.geometry.dispose();
    this.to.position.x = this.from.position.x;
    this.geometry = this.line(this.from.position, this.to.position)
  }
}

export class HorizontalCommand extends BaseCommand {
  constructor(from: PathPoint, to: PathPoint) { super('horizontal', 'H', from, to); }

  override update() {
    if (this.geometry) this.geometry.dispose();
    this.to.position.y = this.from.position.y;
    this.geometry = this.line(this.from.position, this.to.position)
  }
}
