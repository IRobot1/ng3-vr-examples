import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from "@angular/core";

import { BufferGeometry, Group, Material, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

export interface ColumnData {
  label: string;
  value: number;
  geometry: BufferGeometry;
  material: Material;
}

interface ColumnDisplay {
  x: number,
  y: number, // value offset
  data: ColumnData;
}

export type AxisDistribution = 'even' | 'sum';

@Component({
  selector: 'column-chart',
  exportAs: 'columnChart',
  templateUrl: './column-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnChart extends NgtObjectProps<Group>{
  @ContentChild('xaxis') protected xaxis?: TemplateRef<unknown>;
  @ContentChild('value') protected value?: TemplateRef<unknown>;
  @ContentChild('object') protected object?: TemplateRef<unknown>;

  protected display: Array<ColumnDisplay> = []

  private _data: Array<ColumnData> = []
  @Input()
  get data(): Array<ColumnData> { return this._data }
  set data(newvalue: Array<ColumnData>) {
    this._data = newvalue;
    if (newvalue) this.updateFlag = true;
  }

  private _distribution: AxisDistribution = 'even';
  @Input()
  get distribution(): AxisDistribution { return this._distribution }
  set distribution(newvalue: AxisDistribution) {
    this._distribution = newvalue;
    this.updateFlag = true;
  }

  private _width = 4 / 3;
  @Input()
  get width(): number { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    this.updateFlag = true;
  }

  private _spacing = 0.01;
  @Input()
  get spacing(): number { return this._spacing }
  set spacing(newvalue: number) {
    this._spacing = newvalue;
    this.updateFlag = true;
  }


  addColumn(data: ColumnData) {
    this.data.push(data);
    this.updateFlag = true;
  }

  removeColumn(data: ColumnData) {
    this.data = this.data.filter(item => item != data)
    this.updateFlag = true;
  }

  private updateFlag = false;

  private calcDistribution(): Array<number> {
    let result: Array<number> = []
    switch (this.distribution) {
      case 'even':
        const columnwidth = (this.width - this.spacing * (this.data.length + 1)) / this.data.length;
        result = new Array(this.data.length).fill(columnwidth)
        break;
      case 'sum':
        const total = this.data.map(x => x.value).reduce((accum, value) => accum + value);
        this.data.forEach(item => {
          result.push(item.value / total * this.width);
        });
    }
    return result;
  }


  private refresh() {
    this.display.length = 0;

    const columnwidths = this.calcDistribution();
    let x = 0;

    this.data.forEach((data, index) => {
      const halfwidth = (this.spacing + columnwidths[index]) / 2;
      x += halfwidth

      let y = 0;
      if (data.geometry) {
        data.geometry.computeBoundingBox();
        const box = data.geometry.boundingBox;
        if (box) {
          const size = new Vector3();
          box.getSize(size);
          y = size.y;
        }
      }

      this.display.push({ x, y, data });
      x += halfwidth;
    });
  }

  protected tick() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.refresh();
    }
  }
}
