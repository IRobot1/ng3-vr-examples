import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Material, Mesh, Shape, ShapeGeometry, SplineCurve, Vector2 } from "three";
import { make, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { GlobalFlatUITheme } from "ng3-flat-ui";

@Component({
  selector: 'link-curve',
  exportAs: 'linkCurve',
  templateUrl: './link-curve.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkCurve extends NgtObjectProps<Mesh> {
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

  @Input() linewidth = 0.005;

  private _linkmaterial?: Material;
  @Input()
  get linkmaterial(): Material {
    if (this._linkmaterial) return this._linkmaterial;
    return GlobalFlatUITheme.TitleMaterial;
  }
  set linkmaterial(newvalue: Material) {
    this._linkmaterial = newvalue;
  }

  protected mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.mesh = mesh;
    this.updatecurve();
}

  private updatecurve() {
    if (!(this.mesh && this.startposition && this.endposition)) return;

    if (this.mesh.geometry) this.mesh.geometry.dispose();

    const start = make(Vector2, this.startposition);
    const end = make(Vector2, this.endposition);

    const startplus = start.clone()
    const endplus = end.clone()
    const diff = Math.abs(start.x - end.x) / 3;

    startplus.x += diff;
    endplus.x -= diff;

    const points: Array<Vector2> = [start, startplus, endplus, end];

    const curve = new SplineCurve(points);

    const toppoints = curve.getPoints(25);
    const first = toppoints[0]

    const thickline = new Shape()

    thickline.moveTo(first.x, first.y + this.linewidth);
    toppoints.forEach(point => {
      thickline.lineTo(point.x, point.y + this.linewidth);
    });
    toppoints.reverse().forEach(point => {
      thickline.lineTo(point.x, point.y - this.linewidth);
    });
    thickline.closePath();

    this.mesh.geometry = new ShapeGeometry(thickline);
  }
}
