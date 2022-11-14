import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Mesh, Shape, ShapeGeometry, SplineCurve, Vector2 } from "three";
import { make, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { LinkPin } from "../link-pin/link-pin.component";

@Component({
  selector: 'link-curve',
  exportAs: 'linkCurve',
  templateUrl: './link-curve.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkCurve extends NgtObjectProps<Mesh> {
  @Input() startpin!: LinkPin;
  @Input() endpin!: LinkPin;
  @Input() linewidth = 0.005;

  protected mesh!: Mesh;

  private startposition!: NgtTriple;
  private endposition!: NgtTriple;

  override ngOnInit() {
    super.ngOnInit();

    this.startposition = this.startpin.position;
    this.endposition = this.endpin.position;

    this.startpin.change.subscribe(position => {
      this.startposition = position;
      this.updatecurve();
    });

    this.endpin.change.subscribe(position => {
      this.endposition = position;
      this.updatecurve();
    });


    this.updatecurve();
  }


  private updatecurve() {
    if (this.mesh.geometry) this.mesh.geometry.dispose();

    const start = make(Vector2, this.startposition);
    const end = make(Vector2, this.endposition);

    const startplus = start.clone()
    const endplus = end.clone()
    const diff = Math.abs(start.x - end.x)/4;

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
