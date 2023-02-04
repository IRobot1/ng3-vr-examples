import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Box2, BufferGeometry, Group, Material, MathUtils, Vector2, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

export interface LineData {
  label: string;
  values: Array<Vector2>;
  material: Material;
}

interface LineDisplay {
  geometry: BufferGeometry;
  points: Array<Vector3>;
  data: LineData;
}


@Component({
  selector: 'line-chart',
  exportAs: 'lineChart',
  templateUrl: './line-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChart extends NgtObjectProps<Group>{

  protected display: Array<LineDisplay> = []

  private _data: Array<LineData> = []
  @Input()
  get data(): Array<LineData> { return this._data }
  set data(newvalue: Array<LineData>) {
    this._data = newvalue;
    this.updateFlag = true;
  }

  @Input() width = 1;
  @Input() height = 1;
  @Input() margin = 0.1;

  @Input() showmarkers = false;
  @Input() markersize = 0.02;

  private _redraw = false;
  @Input()
  get redraw(): boolean { return this._redraw }
  set redraw(newvalue: boolean) {
    this._redraw = newvalue;
    this.updateFlag = true;
  }

  private updateFlag = false;
  private points: Array<Vector3> = [];
  private box = new Box2();

  private refresh() {

    this.data.forEach((data, index) => {
      const points = this.points;
      points.length = 0;
      const box = this.box;
      box.makeEmpty();

      data.values.forEach(value => box.expandByPoint(value));

      data.values.forEach(value => {
        const x = MathUtils.mapLinear(value.x, box.min.x, box.max.x, this.margin, this.width - this.margin);
        const y = MathUtils.mapLinear(value.y, box.min.y, box.max.y, this.margin, this.height - this.margin);

        points.push(new Vector3(x, y, 0));
      })


      if (this.display.length < this.data.length) {
        const geometry = new BufferGeometry().setFromPoints(points);
        this.display.push({ geometry, points, data });
      }
      else {
        const display = this.display[index];
        display.geometry.setFromPoints(points);
        display.points = points;
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
