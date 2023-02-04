import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Box2, BufferGeometry, ExtrudeGeometry, Group, MathUtils, Shape, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { LineData } from "../line-chart/line-chart.component";

interface AreaDisplay {
  geometry: BufferGeometry;
  data: LineData;
}

@Component({
  selector: 'area-plot',
  exportAs: 'areaPlot',
  templateUrl: './area-plot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaPlot extends NgtObjectProps<Group>{

  protected display: Array<AreaDisplay> = []

  private _data: Array<LineData> = []
  @Input()
  get data(): Array<LineData> { return this._data }
  set data(newvalue: Array<LineData>) {
    this._data = newvalue;
    this.updateFlag = true;
  }

  @Input() width = 1;
  @Input() height = 1;

  private _redraw = false;
  @Input()
  get redraw(): boolean { return this._redraw }
  set redraw(newvalue: boolean) {
    this._redraw = newvalue;
    this.updateFlag = true;
  }

  private updateFlag = false;
  private box = new Box2();
  private options = { bevelEnabled: false, depth: 0.05 };

  private refresh() {

    this.data.forEach((data, index) => {
      const box = this.box;
      box.makeEmpty();

      data.values.forEach(value => box.expandByPoint(value));

      const shape = new Shape();
      data.values.forEach(value => {
        const x = MathUtils.mapLinear(value.x, box.min.x, box.max.x, 0, this.width);
        const y = MathUtils.mapLinear(value.y, box.min.y, box.max.y, 0, this.height);
        shape.lineTo(x, y);
      })
      shape.lineTo(this.width, 0)
      shape.closePath();

      if (this.display.length < this.data.length) {
        const geometry = new ExtrudeGeometry(shape, this.options );
        this.display.push({ geometry, data });
      }
      else {
        const display = this.display[index];
        display.geometry.dispose();
        display.geometry = new ExtrudeGeometry(shape, this.options);
      }
    });

  }

  protected tick() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.refresh();
    }
  }

  addLine(data: LineData) {
    this.data.push(data);
    this.updateFlag = true;
  }

  removeLine(data: LineData) {
    this.data = this.data.filter(item => item != data)
    this.updateFlag = true;
  }


}
