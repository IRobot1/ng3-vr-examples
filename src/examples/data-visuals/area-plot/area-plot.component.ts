import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Box2, BufferGeometry, ExtrudeGeometry, Group, Material, MathUtils, Shape, SplineCurve, Vector2 } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { LineData } from "../line-plot/line-plot.component";


@Component({
  selector: 'area-plot',
  exportAs: 'areaPlot',
  templateUrl: './area-plot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaPlot extends NgtObjectProps<Group>{

  protected geometry!: BufferGeometry;

  private _data!: LineData
  @Input()
  get data(): LineData { return this._data }
  set data(newvalue: LineData) {
    this._data = newvalue;
    this.updateFlag = true;
  }

  @Input() width = 1;
  @Input() height = 1;
  @Input() maxy = 0;

  @Input() smooth = false;

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
    if (!this.data.values.length) return;

    const box = this.box;
    box.makeEmpty();

    this.data.values.forEach(value => box.expandByPoint(value));
    if (this.maxy) box.expandByPoint(<Vector2>{ x: box.min.x, y: this.maxy })

    let points: Array<Vector2> = []
    this.data.values.forEach(value => {
      const x = MathUtils.mapLinear(value.x, box.min.x, box.max.x, 0, this.width);
      const y = MathUtils.mapLinear(value.y, box.min.y, box.max.y, 0, this.height);
      points.push(<Vector2>{ x, y });
    })

    if (this.smooth) {
      const curve = new SplineCurve(points);
      points = curve.getPoints(this.data.values.length * 5);
    }
    points.push(<Vector2>{ x: this.width, y: 0 })
    points.push(<Vector2>{ x: 0, y: 0 })

    if (this.geometry) this.geometry.dispose();

    const shape = new Shape(points);
    this.geometry = new ExtrudeGeometry(shape, this.options);

  }

  protected tick() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.refresh();
    }
  }
}
