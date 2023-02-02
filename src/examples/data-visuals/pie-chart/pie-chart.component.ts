import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from "@angular/core";

import { BufferGeometry, ExtrudeGeometry, ExtrudeGeometryOptions, Group, Material, Mesh, Object3D, Shape, ShapeGeometry, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

export interface PieData {
  label: string;
  value: number;
  material: Material;
}

interface PieDisplay {
  geometry: BufferGeometry;
  x: number,
  z: number,
  center: Vector3,
  radians: number,
  data: PieData;
}


@Component({
  selector: 'pie-chart',
  exportAs: 'pieChart',
  templateUrl: './pie-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChart extends NgtObjectProps<Group>{
  @ContentChild('object') protected object?: TemplateRef<unknown>;

  protected display: Array<PieDisplay> = []
  private total = 0;

  private _data: Array<PieData> = []
  @Input()
  get data(): Array<PieData> { return this._data }
  set data(newvalue: Array<PieData>) {
    this._data = newvalue;
    if (newvalue) {
      this.total = newvalue.map(x => x.value).reduce((accum, value) => accum + value);

      this.updateFlag = true;
    }
  }

  private _spacing = 0;
  @Input()
  get spacing(): number { return this._spacing }
  set spacing(newvalue: number) {
    this._spacing = newvalue;
    this.updateFlag = true;
  }

  private _radius = 0.3;
  @Input()
  get radius(): number { return this._radius }
  set radius(newvalue: number) {
    this._radius = newvalue;
    this.updateFlag = true;
  }

  private _extrude = true;
  @Input()
  get extrude(): boolean { return this._extrude }
  set extrude(newvalue: boolean) {
    this._extrude = newvalue;
    this.updateFlag = true;
  }

  private _extrudeoptions: ExtrudeGeometryOptions = { bevelEnabled: false, depth: 0.06, bevelSize: 0.01 }
  @Input()
  get extrudeoptions(): ExtrudeGeometryOptions { return this._extrudeoptions }
  set extrudeoptions(newvalue: ExtrudeGeometryOptions) {
    this._extrudeoptions = newvalue;
    this.updateFlag = true;
  }

  private createPieShape(radius: number, endradians: number): Shape {
    const shape = new Shape()
      .lineTo(radius, 0)

    const segment = endradians / 180;
    for (let angle = 0; angle <= endradians; angle += segment) {
      const outerx = radius * Math.cos(angle)
      const outery = radius * Math.sin(angle)

      shape.lineTo(outerx, outery);
    }
    shape.closePath();

    return shape;
  }


  private updateFlag = false;

  private refresh() {
    this.display.length = 0;

    let radians = 0;
    this.data.forEach((data, index) => {
      const slice = data.value / this.total * Math.PI * 2;

      const shape = this.createPieShape(this.radius, slice);

      let geometry: BufferGeometry;
      if (this.extrude)
        geometry = new ExtrudeGeometry(shape, this.extrudeoptions);
      else
        geometry = new ShapeGeometry(shape);

      // add offset from center
      const halfslide = slice / 2;
      const x = Math.cos(halfslide) * this.spacing;
      const z = Math.sin(halfslide) * this.spacing;

      geometry.rotateX(halfslide) // temporarily rotate to center of slice
      geometry.translate(x, 0, z) // translate by offset
      geometry.rotateX(-halfslide) // remove rotation back to sta

      geometry.computeBoundingBox();
      const box = geometry.boundingBox;
      let center = new Vector3();
      if (box) {
        const size = new Vector3();
        box.getSize(size);

        box.getCenter(center);
        center.z += size.z / 2;
      }

      this.display.push({ geometry, x, z, center, radians, data });

      radians += slice;
    });
  }

  protected tick() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.refresh();
    }
  }
}
