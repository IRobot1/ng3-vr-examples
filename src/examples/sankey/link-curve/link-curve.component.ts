import { Component, Input } from "@angular/core";

import { BufferGeometry, CatmullRomCurve3, Mesh, Vector3 } from "three";
import { make, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { LinkPin } from "../link-pin/link-pin.component";

@Component({
  selector: 'link-curve',
  exportAs: 'linkCurve',
  templateUrl: './link-curve.component.html',
})
export class LinkCurve extends NgtObjectProps<Mesh> {
  @Input() startpin!: LinkPin;
  @Input() endpin!: LinkPin;

  geometry!: BufferGeometry;

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
    if (this.geometry) this.geometry.dispose();

    const start = make(Vector3, this.startposition);
    const end = make(Vector3, this.endposition);

    const startplus = start.clone()
      startplus.x += 0.5;
    const endplus = end.clone()
      endplus.x -= 0.5;

    const points: Array<Vector3> = [start, startplus, endplus, end];

    const closed = false;
    const curvetype: 'centripetal' | 'catmullrom' | 'chordial' = 'centripetal';
    const tension = 0.1;


    const curve = new CatmullRomCurve3(points);
    const curvepoints = curve.getPoints(25);

    this.geometry = new BufferGeometry().setFromPoints(curvepoints);
  }
}
