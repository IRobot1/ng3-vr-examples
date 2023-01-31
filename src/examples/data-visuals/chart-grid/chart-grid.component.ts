import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { NgtObjectProps } from "@angular-three/core";

import { BoxLineGeometry } from 'three-stdlib';
import { BufferGeometry, Float32BufferAttribute, LineSegments } from "three";


@Component({
  selector: 'chart-grid',
  exportAs: 'chartGrid',
  templateUrl: './chart-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartGrid extends NgtObjectProps<LineSegments> {
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

  protected geometry = new BufferGeometry();

  private refresh() {
    // adapted from https://github.com/mrdoob/three.js/blob/master/src/helpers/GridHelper.js
    const vertices = [];

    for (let i = 0, w = 0; i <= this.width * 10; i++, w += 0.1) {
      for (let j = 0, h = 0; j <= this.height * 10; j++, h += 0.1) {

        vertices.push(0, h, 0, this.width, h, 0);
        vertices.push(w, 0, 0, w, this.height, 0);
      }
    }

    this.geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  }
}
