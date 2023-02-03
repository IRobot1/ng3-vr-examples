import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BufferGeometry, CircleGeometry, CylinderGeometry, ExtrudeGeometry, Group, Material, MathUtils, Mesh, Object3D, Shape, ShapeGeometry, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";
import { degToRad } from "three/src/math/MathUtils";

export interface StackData {
  label: string;
  value: number;
  material: Material;
}

interface StackDisplay {
  geometry: BufferGeometry;
  height: number;
  y: number;
  labeloffset: number;
  labelrotate: number;
  labeltilt: number;
  data: StackData;
}


@Component({
  selector: 'stacked-bar',
  exportAs: 'stackedBar',
  templateUrl: './stacked-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackedBar extends NgtObjectProps<Group>{

  protected display: Array<StackDisplay> = []

  private _data: Array<StackData> = []
  @Input()
  get data(): Array<StackData> { return this._data }
  set data(newvalue: Array<StackData>) {
    this._data = newvalue;
    this.updateFlag = true;
  }

  private _height = 1;
  @Input()
  get height(): number { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    this.updateFlag = true;
  }

  private _segments = 4; // box
  @Input()
  get segments(): number { return this._segments }
  set segments(newvalue: number) {
    this._segments = Math.max(newvalue, 3);
    this.updateFlag = true;
  }

  private _topradius = 0.3
  @Input()
  get topradius(): number { return this._topradius }
  set topradius(newvalue: number) {
    this._topradius = newvalue;
    this.updateFlag = true;
  }

private _bottomradius = 0.3;
  @Input()
  get bottomradius(): number { return this._bottomradius }
  set bottomradius(newvalue: number) {
    this._bottomradius = newvalue;
    this.updateFlag = true;
  }

  private _spacing = 0;
  @Input()
  get spacing(): number { return this._spacing }
  set spacing(newvalue: number) {
    this._spacing = newvalue;
    this.updateFlag = true;
  }

  private _rotatetext = 0;
  @Input()
  get rotatetext(): number { return this._rotatetext }
  set rotatetext(newvalue: number) {
    this._rotatetext = newvalue;
    this.updateFlag = true;
  }


  private updateFlag = true;

  private refresh() {
    this.display.forEach(item => {
      if (item.geometry) item.geometry.dispose();
    })

    this.display.length = 0;
    const total = this.data.map(x => x.value).reduce((accum, value) => accum + value);
    let bottomradius = this.bottomradius;
    let topradius = this.bottomradius;
    let y = 0;
    let labelrotate = -MathUtils.degToRad(180 / this.segments);

    // calculate distance from center to face
    const facedistance = this.bottomradius * Math.cos(Math.PI / this.segments);

    // calculate the angle of the face
    const labeltilt = Math.atan(this.height / facedistance) - Math.PI / 2;

    this.data.forEach((data, index) => {
      // calculate height of segment relative to total and overall height
      const height = data.value / total * this.height;

      // calculate radius at top relative to total height and overall radius
      const radius = height / this.height * this.bottomradius;

      const geometry = new CylinderGeometry(topradius - radius, bottomradius, height, this.segments);
      geometry.translate(0, height / 2, 0); // change center to bottom of segment

      // calculate distance from center to face for middle of this segment
      const labeloffset = (topradius - radius / 2) * Math.cos(Math.PI/this.segments);

      this.display.push({ geometry, y, height, labeloffset, labeltilt, labelrotate, data });

      topradius -= radius;
      y += height;
      bottomradius = topradius;
    });

  }

  protected tick() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.refresh();
    }
  }

  addSegment(data: StackData) {
    this.data.push(data);
    this.updateFlag = true;
  }

  removeSegment(data: StackData) {
    this.data = this.data.filter(item => item != data)
    this.updateFlag = true;
  }


}
