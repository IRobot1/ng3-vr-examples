import { BufferGeometry, CubicBezierCurve, Mesh, QuadraticBezierCurve, SplineCurve, Vector2, Vector3 } from "three";

export class PathPoint {
  private _mesh!: Mesh;
  get mesh(): Mesh { return this._mesh }
  set mesh(newvalue: Mesh) {
    newvalue.position.set(this.position.x, this.position.y, this.z);
    this._mesh = newvalue;
  }

  changex = true; // allow x to change
  changey = true; // allow y to change

  constructor(public position: Vector2, public z = 0.002, public color = 'white', public control = false) { }
}


export type CommandType = 'control' | 'moveto' | 'lineto' | 'vertical' | 'horizontal' | 'cubic' | 'quadratic' | 'closepath'

export abstract class BaseCommand {
  geometry?: BufferGeometry;

  line(start: Vector2, end: Vector2): BufferGeometry {
    const points: Array<Vector2> = [start, end]
    return new BufferGeometry().setFromPoints(points);
  }

  quadratic(v0: Vector2, v1: Vector2, v2: Vector2): BufferGeometry {
    const curve = new QuadraticBezierCurve(v0, v1, v2);
    const curvepoints = curve.getPoints(25);
    return new BufferGeometry().setFromPoints(curvepoints);
  }

  cubic(v0: Vector2, v1: Vector2, v2: Vector2, v3: Vector2): BufferGeometry {
    const curve = new CubicBezierCurve(v0, v1, v2, v3);
    const curvepoints = curve.getPoints(25);
    return new BufferGeometry().setFromPoints(curvepoints);
  }



  constructor(public type: CommandType, public text: string, public endpoint: PathPoint, public name='') {  }

  public update(from: PathPoint) { };
}

export class ControlPoint {
  geometry!: BufferGeometry;

  update(from: Vector2, to: Vector2) {
    if (this.geometry) this.geometry.dispose();
    const points: Array<Vector2> = [from, to]
    this.geometry = new BufferGeometry().setFromPoints(points);
  }
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

export class CubicCurveCommand extends BaseCommand {
  line1 = new ControlPoint();
  line2 = new ControlPoint();

  constructor(public cp1: PathPoint, public cp2: PathPoint, to: PathPoint) { super('cubic', 'C', to); }

  override update(from: PathPoint) {
    if (this.geometry) this.geometry.dispose();
    this.geometry = this.cubic(from.position, this.cp1.position, this.cp2.position, this.endpoint.position);
    this.line1.update(from.position, this.cp1.position)
    this.line2.update(this.endpoint.position, this.cp2.position);
  }
}

export class QuadraticCurveCommand extends BaseCommand {
  line1 = new ControlPoint();
  line2 = new ControlPoint();

  constructor(public cp: PathPoint, to: PathPoint) { super('quadratic', 'Q', to); }

  override update(from: PathPoint) {
    if (this.geometry) this.geometry.dispose();
    this.geometry = this.quadratic(from.position, this.cp.position, this.endpoint.position);
    this.line1.update(from.position, this.cp.position)
    this.line2.update(this.endpoint.position, this.cp.position);
  }
}


export class ClosePathCommand extends BaseCommand {
  constructor(public first: PathPoint, to: PathPoint) {
    super('closepath', 'Z', to);
  }

  override update(from: PathPoint) {
    if (this.geometry) this.geometry.dispose();
    this.endpoint.position.x = this.endpoint.mesh.position.x = this.first.position.x;
    this.endpoint.position.y = this.endpoint.mesh.position.y = this.first.position.y;
    this.geometry = this.line(from.position, this.endpoint.position)
  }
}

