import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BufferGeometry, Group, Material, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { LabelAlignY } from "ng3-flat-ui";

export interface ColumnData {
  label: string;
  minorlabel?: string;
  value: number;
  displayvalue?: string;
  geometry: BufferGeometry;
  material: Material;
}

interface ColumnDisplay {
  x: number,
  y: number, // value offset
  displayvalue: string,
  labelalign: LabelAlignY,
  minorlabel: string,
  data: ColumnData;
}

@Component({
  selector: 'column-chart',
  exportAs: 'columnChart',
  templateUrl: './column-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnChart extends NgtObjectProps<Group>{
  protected display: Array<ColumnDisplay> = []

  private _data: Array<ColumnData> = []
  @Input()
  get data(): Array<ColumnData> { return this._data }
  set data(newvalue: Array<ColumnData>) {
    this._data = newvalue;
    if (newvalue) this.refresh();
  }

  @Input() calloutmaterial: Material | undefined;

  private refresh() {
    this.display.length = 0;
    const columnwidth = (this.width - this.spacing * (this.data.length + 1)) / this.data.length;
    let x = this.spacing + columnwidth / 2;
    this.data.forEach(data => {
      let displayvalue = data.displayvalue;
      if (!displayvalue) displayvalue = data.value.toString();

      data.geometry.computeBoundingBox();
      let y = 0;
      const box = data.geometry.boundingBox;
      if (box) {
        const size = new Vector3();
        box.getSize(size);
        y = size.y;
      }

      let labelalign: LabelAlignY = 'middle';
      let minorlabel = '';
      if (data.minorlabel) {
        minorlabel = data.minorlabel;
        labelalign = 'bottom';
      }

      this.display.push({ x, y, data, displayvalue, minorlabel, labelalign })
      x += columnwidth + this.spacing;
    });
  }

  @Input() width = 4 / 3;
  @Input() spacing = 0.01;

  @Input() labelmaterial!: Material

  addColumn(data: ColumnData) {
    this.data.push(data);
    this.refresh();
  }

  removeColumn(data: ColumnData) {
    this.data = this.data.filter(item => item != data)
    this.refresh();
  }

}
