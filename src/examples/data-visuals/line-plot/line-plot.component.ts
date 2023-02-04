import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Box2, BufferGeometry, Group, Material, MathUtils, Vector2, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

export interface LineData {
  label: string;
  values: Array<Vector2>;
  material: Material;
}


@Component({
  selector: 'line-plot',
  exportAs: 'linePlot',
  templateUrl: './line-plot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinePlot extends NgtObjectProps<Group>{

  private _data!: LineData
  @Input()
  get data(): LineData { return this._data }
  set data(newvalue: LineData) {
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

  protected geometry = new BufferGeometry();
  protected points: Array<Vector3> = [];

  private updateFlag = false;
  private box = new Box2();

  private refresh() {

    const points = this.points;
    points.length = 0;
    const box = this.box;
    box.makeEmpty();

    this.data.values.forEach(value => box.expandByPoint(value));

    this.data.values.forEach(value => {
      const x = MathUtils.mapLinear(value.x, box.min.x, box.max.x, this.margin, this.width - this.margin);
      const y = MathUtils.mapLinear(value.y, box.min.y, box.max.y, this.margin, this.height - this.margin);

      points.push(new Vector3(x, y, 0));
    })

    this.geometry.setFromPoints(points);
  }

  protected tick() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.refresh();
    }
  }

}
