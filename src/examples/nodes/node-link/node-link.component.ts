import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { CubicBezierCurve, Material, Mesh, Object3D, Shape, ShapeGeometry, SplineCurve, Vector2, Vector3 } from "three";
import { make, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { GlobalFlatUITheme } from "ng3-flat-ui";

export interface NodeLink {
  name: string;
  start?: NgtTriple;
  end?: NgtTriple;
  size: number;
  material: Material;
}

@Component({
  selector: 'flat-ui-node-link',
  exportAs: 'flatUINodeLink',
  templateUrl: './node-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatUINodeLink extends NgtObjectProps<Mesh> {
  private _startposition?: NgtTriple;
  @Input()
  get startposition(): NgtTriple | undefined { return this._startposition }
  set startposition(newvalue: NgtTriple | undefined) {
    this._startposition = newvalue;
    if (newvalue)
      this.updatecurve();
  }

  private _endposition?: NgtTriple;
  @Input()
  get endposition(): NgtTriple | undefined { return this._endposition }
  set endposition(newvalue: NgtTriple | undefined) {
    this._endposition = newvalue;
    if (newvalue)
      this.updatecurve();
  }

  @Input() linewidth = 0.02;

  private _linkmaterial?: Material;
  @Input()
  get linkmaterial(): Material {
    if (this._linkmaterial) return this._linkmaterial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set linkmaterial(newvalue: Material) {
    this._linkmaterial = newvalue;
  }

  protected mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.mesh = mesh;
    this.updatecurve();
    this.ready.next(mesh);
}

  updatecurve() {
    if (!(this.mesh && this.startposition && this.endposition)) return;

    if (this.mesh.geometry) this.mesh.geometry.dispose();

    const start = make(Vector2, this.startposition);
    const end = make(Vector2, this.endposition);

    const startplus = start.clone()
    const endplus = end.clone()

    const diff = Math.abs(start.x - end.x) / 3;

    startplus.x += diff;
    endplus.x -= diff;

    const curve = new CubicBezierCurve(start, startplus, endplus, end);

    const points = curve.getPoints(50);

    const mesh = new Object3D();
    const topobject = new Object3D();
    topobject.position.set(0, this.linewidth / 2, 0.001);

    const bottomobject = new Object3D();
    bottomobject.position.set(0, -this.linewidth / 2, 0.001);
    mesh.add(topobject).add(bottomobject);

    const shape = new Shape();

    let point = points[0]

    mesh.position.set(point.x, point.y, 0);

    const topworld = new Vector3();
    const botworld = new Vector3();

    topobject.getWorldPosition(topworld)
    shape.moveTo(topworld.x, topworld.y)

    bottomobject.getWorldPosition(botworld)

    point = points[1]
    mesh.lookAt(point.x, point.y, 0)

    const bottompoints: Array<Vector2> = [new Vector2(botworld.x, botworld.y)];

    const add = (topworld: Vector3, botworld: Vector3) => {
      shape.lineTo(topworld.x, topworld.y)
      bottompoints.push(new Vector2(botworld.x, botworld.y))

    }
    points.forEach((point, index) => {
      if (index < 1) return;
      mesh.position.set(point.x, point.y, 0);

      topobject.getWorldPosition(topworld)
      bottomobject.getWorldPosition(botworld)

      // start is left of end and above
      if (start.x <= end.x) {
        add(topworld, botworld);
      }
      else {
        // start is right of end
        if (start.y >= end.y) {
          if (topworld.x >= botworld.x) {
            add(topworld, botworld);
          }
          else { // flip top and bottom
            add(botworld, topworld);
          }
        }
        else {
          if (topworld.x <= botworld.x) {
            add(topworld, botworld);
          }
          else { // flip top and bottom
            add(botworld, topworld);
          }
        }
      }


      if (index + 2 == points.length)
        mesh.rotation.set(0, 0, 0)
      else if (index + 1 < points.length) {
        const next = points[index + 1]
        mesh.lookAt(next.x, next.y, 0)
      }
    });

    bottompoints.reverse().forEach((point, index) => {
      shape.lineTo(point.x, point.y)
    });

    shape.closePath();

    this.mesh.geometry = new ShapeGeometry(shape);
  }
}
