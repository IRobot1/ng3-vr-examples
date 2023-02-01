import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from "@angular/core";

import { BufferGeometry, Group, Material, Mesh, Object3D, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

export interface PieData {
  label: string;
  value: number;
  geometry: BufferGeometry;
  material: Material;
}

interface PieDisplay {
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


  private updateFlag = false;

  private refresh() {
    this.display.length = 0;

    let radians = 0;
    this.data.forEach((data, index) => {
      const slice = data.value / this.total * Math.PI * 2;

      // add offset from center
      const halfslide = slice / 2;
      const x = Math.cos(halfslide) * this.spacing;
      const z = Math.sin(halfslide) * this.spacing;

      data.geometry.rotateX(halfslide) // temporarily rotate to center of slice
      data.geometry.translate(x, 0, z) // translate by offset
      data.geometry.rotateX(-halfslide) // remove rotation back to sta

      data.geometry.computeBoundingBox();
      const box = data.geometry.boundingBox;
      let center = new Vector3();
      if (box) {
        const size = new Vector3();
        box.getSize(size);

        box.getCenter(center);
        center.z += size.z/2;
      }

      this.display.push({ x, z, center, radians, data });

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
