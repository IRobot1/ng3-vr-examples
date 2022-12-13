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



  constructor(public type: CommandType, public text: string, public endpoint: PathPoint, public name='') {  }

  public update(from: PathPoint) { };
}

export class MoveToCommand extends BaseCommand {
  constructor(to: PathPoint) { super('moveto', 'M', to); }
}

export class LineToCommand extends BaseCommand {
  constructor(to: PathPoint) {
    super('lineto', 'L', to);
  }

  override update(from: PathPoint) {
    if (this.geometry) this.geometry.dispose();
    this.geometry = this.line(from.position, this.endpoint.position)
  }
}

export class VerticalCommand extends BaseCommand {
  constructor(to: PathPoint) { super('vertical', 'V', to); }

  override update(from: PathPoint) {
    if (this.geometry) this.geometry.dispose();
    this.endpoint.position.x = from.position.x;
    this.geometry = this.line(from.position, this.endpoint.position)
  }
}

export class HorizontalCommand extends BaseCommand {
  constructor(to: PathPoint) { super('horizontal', 'H', to); }

  override update(from: PathPoint) {
    if (this.geometry) this.geometry.dispose();
    this.endpoint.position.y = from.position.y;
    this.geometry = this.line(from.position, this.endpoint.position)
  }
}
