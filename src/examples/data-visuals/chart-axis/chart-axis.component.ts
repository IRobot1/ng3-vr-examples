import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { NgtObjectProps } from "@angular-three/core";

import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial, LineSegments } from "three";


@Component({
  selector: 'chart-axis',
  exportAs: 'chartAxis',
  templateUrl: './chart-axis.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartAxis extends NgtObjectProps<LineSegments> {
  private _width = 4 / 3;
  @Input()
  get width(): number { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    this.refresh();
  }


  private _height = 1;
  @Input()
  get height(): number { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    this.refresh();
  }

  @Input() material = new LineBasicMaterial({ color: 'white', transparent: true, opacity: 0.5 });

  protected geometry = new BufferGeometry();

  private refresh() {
    const vertices = [];

    vertices.push(-0.1, 0, 0, this.width, 0, 0);
    vertices.push(0, -0.1, 0, 0, this.height, 0);

    this.geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  }
}
