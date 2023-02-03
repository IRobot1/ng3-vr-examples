import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BufferGeometry, ExtrudeGeometry, Group, Material, Mesh, Object3D, Shape, ShapeGeometry, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

export interface PieData {
  label: string;
  labelsize: number;
  value: number;
  material: Material;
}

interface PieDisplay {
  geometry: BufferGeometry;
  center?: Vector3;  // calculated after mesh is rendered
  slice: number; // in radians
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

  protected display: Array<PieDisplay> = []
  protected total = 0;

  private _data: Array<PieData> = []
  @Input()
  get data(): Array<PieData> { return this._data }
  set data(newvalue: Array<PieData>) {
    this._data = newvalue;
      this.updateFlag = true;
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

  private _rotatetext = 0;
  @Input()
  get rotatetext(): number { return this._rotatetext }
  set rotatetext(newvalue: number) {
    this._rotatetext = newvalue;
    this.updateFlag = true;
  }

  private _extrude = true;
  @Input()
  get extrude(): boolean { return this._extrude }
  set extrude(newvalue: boolean) {
    this._extrude = newvalue;
    this.updateFlag = true;
  }

  private _depth = 0.1
  @Input()
  get depth(): number { return this._depth }
  set depth(newvalue: number) {
    this._depth = newvalue;
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

  protected meshready(mesh: Mesh, item: PieDisplay) {
    const object = new Object3D()
    mesh.add(object);

    const halfslice = item.slice / 2;
    if (this.spacing) {
      // translate away from center
      mesh.translateX(Math.cos(halfslice) * this.spacing)
      mesh.translateY(Math.sin(halfslice) * this.spacing)
    }

    let offset = 0.6;
    if (item.slice < Math.PI / 2) {
      offset = 0.7;
    }
    // roughly calculate center of slice
    object.translateX(Math.cos(halfslice) * this.radius * offset);
    object.translateY(Math.sin(halfslice) * this.radius * offset);
    object.translateZ(this.depth)

    // center for placing text
    item.center = object.position;
    mesh.remove(object)
  }

  private updateFlag = false;

  private refresh() {
    this.display.length = 0;
    this.total = this.data.map(x => x.value).reduce((accum, value) => accum + value);

    let radians = 0;
    this.data.forEach((data, index) => {
      const slice = data.value / this.total * Math.PI * 2;

      const shape = this.createPieShape(this.radius, slice);

      let geometry: BufferGeometry;
      if (this.extrude)
        geometry = new ExtrudeGeometry(shape, { bevelEnabled: false, depth: this.depth });
      else
        geometry = new ShapeGeometry(shape);

      this.display.push({ geometry, slice, radians, data });

      radians += slice;
    });
  }

  protected tick() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.refresh();
    }
  }

  addSlice(data: PieData) {
    this.data.push(data);
    this.updateFlag = true;
  }

  removeSlice(data: PieData) {
    this.data = this.data.filter(item => item != data)
    this.updateFlag = true;
  }


}
