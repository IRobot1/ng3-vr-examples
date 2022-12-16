import { BufferGeometry, CubicBezierCurve, Mesh, QuadraticBezierCurve, SplineCurve, Vector2, Vector3 } from "three";

export const SHAPEZ = -0.002;
export const MOVETOZ = 0.001;
export const POINTZ = 0.002;
export const CONTROLPOINTZ = 0.003;
export const CLOSEPATHZ = 0.004;
export const MENUZ = 0.005;
export const GUIZ = 0.009;

export class PathPoint {
  private _mesh!: Mesh;
  get mesh(): Mesh { return this._mesh }
  set mesh(newvalue: Mesh) {
    newvalue.position.set(this.position.x, this.position.y, this.z);
    this._mesh = newvalue;
  }

  changex = true; // allow x to change
  changey = true; // allow y to change

  constructor(public position: Vector2, public z = POINTZ, public color = 'white', public control = false) {
    position.x = +position.x.toFixed(2);
    position.y = +position.y.toFixed(2);
  }
}


export type CommandType = 'control' | 'moveto' | 'lineto' | 'vertical' | 'horizontal' | 'cubic' | 'quadratic' | 'closepath'

export abstract class BaseCommand {
  geometry?: BufferGeometry;
  points!: Array<Vector2>;

  line(start: Vector2, end: Vector2): BufferGeometry {
    this.points = [start, end]
    return new BufferGeometry().setFromPoints(this.points);
  }

  quadratic(v0: Vector2, v1: Vector2, v2: Vector2): BufferGeometry {
    const curve = new QuadraticBezierCurve(v0, v1, v2);
    this.points = curve.getPoints(25);
    return new BufferGeometry().setFromPoints(this.points);
  }

  cubic(v0: Vector2, v1: Vector2, v2: Vector2, v3: Vector2): BufferGeometry {
    const curve = new CubicBezierCurve(v0, v1, v2, v3);
    this.points = curve.getPoints(25);
    return new BufferGeometry().setFromPoints(this.points);
  }



  constructor(public type: CommandType, public text: string, public endpoint: PathPoint, public name = '') { }

  public abstract update(from: PathPoint): void;
  public abstract get path(): string;
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

  override update(from: PathPoint) { }
  override get path(): string { return `M ${this.endpoint.position.x} ${this.endpoint.position.y}` }
}

export class LineToCommand extends BaseCommand {
  constructor(to: PathPoint) {
    super('lineto', 'L', to);
  }

  override update(from: PathPoint) {
    if (this.geometry) this.geometry.dispose();
    this.geometry = this.line(from.position, this.endpoint.position)
  }

  override get path(): string { return `L ${this.endpoint.position.x} ${this.endpoint.position.x}` }
}

export class VerticalCommand extends BaseCommand {
  constructor(to: PathPoint) { super('vertical', 'V', to); }

  override update(from: PathPoint) {
    if (this.geometry) this.geometry.dispose();
    this.endpoint.position.x = from.position.x;
    this.geometry = this.line(from.position, this.endpoint.position)
  }

  override get path(): string { return `V ${this.endpoint.position.y} ` }

}

export class HorizontalCommand extends BaseCommand {
  constructor(to: PathPoint) { super('horizontal', 'H', to); }

  override update(from: PathPoint) {
    if (this.geometry) this.geometry.dispose();
    this.endpoint.position.y = from.position.y;
    this.geometry = this.line(from.position, this.endpoint.position)
  }

  override get path(): string { return `H ${this.endpoint.position.x}` }
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

  override get path(): string {
    return `C ${this.cp1.position.x} ${this.cp1.position.x} ${this.cp2.position.x} ${this.cp2.position.x} ${this.endpoint.position.x} ${this.endpoint.position.x}`
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

  override get path(): string {
    return `C ${this.cp.position.x} ${this.cp.position.x} ${this.endpoint.position.x} ${this.endpoint.position.x}`
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

  override get path(): string { return 'Z' }
}


