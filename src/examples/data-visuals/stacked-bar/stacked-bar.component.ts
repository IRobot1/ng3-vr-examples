import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from "@angular/core";

import { BufferGeometry, CylinderGeometry, Group, Material, MathUtils } from "three";

import { NgtObjectProps } from "@angular-three/core";

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
  labelsize: number;
  data: StackData;
}

export type StackTop = 'flat' | 'point'
export type StackDistribution = 'equal' | 'value' ;

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
    this.display.length = 0;
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

  private _top: StackTop = 'flat'
  @Input()
  get top(): StackTop { return this._top }
  set top(newvalue: StackTop) {
    this._top = newvalue;
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

  private _distribution: StackDistribution = 'value';
  @Input()
  get distribution(): StackDistribution { return this._distribution }
  set distribution(newvalue: StackDistribution) {
    this._distribution = newvalue;
    this.updateFlag = true;
  }

  constructor(private cd: ChangeDetectorRef) { super(); }

  private updateFlag = true;

  private calcDistribution(): Array<number> {
    let result: Array<number> = []
    switch (this.distribution) {
      case 'equal':
        const barheight = this.height / this.data.length;
        result = new Array(this.data.length).fill(barheight)
        break;
      case 'value':
        const sumtotal = this.data.map(x => x.value).reduce((accum, value) => accum + value);
        this.data.forEach(item => {
          result.push(item.value / sumtotal * this.height);
        });
        break;
    }
    return result;
  }

  private refresh() {
    if (!this.data.length) return;

    const barheights = this.calcDistribution();

    let bottomradius = this.bottomradius;
    let y = 0;

    let topradius = this.bottomradius;
    let labelrotate = -MathUtils.degToRad(180 / this.segments);

    let labeltilt = 0
    if (this.top == 'point') {
      // calculate distance from center to face
      const facedistance = this.bottomradius * Math.cos(Math.PI / this.segments);

      // calculate the angle of the face
      labeltilt = Math.atan(this.height / facedistance) - Math.PI / 2;
    }

    this.data.forEach((data, index) => {
      // calculate height of segment relative to total and overall height
      const height = barheights[index];

      if (this.top == 'point') {
        // calculate radius at top relative to total height and overall radius
        const radius = height / this.height * this.bottomradius;

        const geometry = new CylinderGeometry(topradius - radius, bottomradius, height, this.segments);
        geometry.translate(0, height / 2, 0); // change center to bottom of segment

        // calculate distance from center to face for middle of this segment
        const labeloffset = (topradius - radius / 3) * Math.cos(Math.PI / this.segments);
        const labelsize = MathUtils.mapLinear(index, 0, this.data.length, 0.07, 0.01);

        if (this.display.length < this.data.length)
          this.display.push({ geometry, y, height, labeloffset, labeltilt, labelrotate, labelsize, data });
        else {
          const display = this.display[index];
          display.geometry = geometry;
          display.labeloffset = labeloffset;
          display.labeltilt = labeltilt;
          display.labelrotate = labelrotate;
        }

        topradius -= radius;  // decrease until point
        bottomradius = topradius;
      }
      else {
        const geometry = new CylinderGeometry(bottomradius, bottomradius, height, this.segments);
        geometry.translate(0, height / 2, 0); // change center to bottom of segment

        const labeloffset = bottomradius * Math.cos(Math.PI / this.segments);

        if (this.display.length < this.data.length)
          this.display.push({ geometry, y, height, labeloffset, labeltilt, labelrotate, labelsize: 0.07, data });
        else {
          const display = this.display[index];
          display.geometry = geometry;
          display.labeloffset = labeloffset;
          display.labelrotate = labelrotate;
        }
      }

      // move up the stack
      y += height + this.spacing;
    });
    this.cd.detectChanges();
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
