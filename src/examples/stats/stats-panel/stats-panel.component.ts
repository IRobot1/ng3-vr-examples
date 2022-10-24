import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { NgtObjectProps } from "@angular-three/core";

import { Color, Group, InstancedMesh, MathUtils, Matrix4, Vector3 } from "three";
import { NgtSobaText } from "@angular-three/soba/abstractions";

import { GlobalFlatUITheme } from "ng3-flat-ui";

@Component({
  selector: 'flat-ui-stats-panel',
  exportAs: 'flatUIStatsPanel',
  templateUrl: './stats-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatUIStatsPanelComponent extends NgtObjectProps<Group> {
  @Input() barcolor = 'white';

  protected width = 0.6;
  protected height = 0.45;

  protected labelmaterial = GlobalFlatUITheme.LabelMaterial;

  protected title!: NgtSobaText;
  titleready(text: NgtSobaText) {
    this.title = text;
  }

  inst!: InstancedMesh
  instready(inst: InstancedMesh) {
    const barcolor = new Color().setStyle(this.barcolor)
    for (let i = 0; i < 60; i++)
      inst.setColorAt(i, barcolor);

    this.inst = inst;
  }


  protected data: Array<number> = [];

  private min = Infinity;
  private max = 0;

  private _matrix = new Matrix4();
  private _scale = new Vector3(1, 1, 1)

  addvalue(value: number, maxValue: number) {

    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);

    this.title.text = Math.round(value) + ' ' + this.name + ' (' + Math.round(this.min) + '-' + Math.round(this.max) + ')'

    // once the array grows to capacity, shift values and replace last
    if (this.data.length == 60) {
      this.data.shift()
      this.data[59] = value;
    }
    else {
      // add while below capacity
      this.data.push(value)
    }

    const range = value / maxValue;

    this.data.forEach((item, index) => {
      this._matrix.identity();  // reset
      // scale to 88% of height.  Top reserved for text
      this._scale.y = MathUtils.mapLinear(item, this.min, this.max, 0, 1) * 0.88 * range;
      this._matrix.scale(this._scale)

      // position based on index and adjust height
      this._matrix.setPosition(-this.width / 2 + index * 0.01 + 0.005, -this.height / 2 + (this._scale.y * this.height) / 2, 0.001);
      this.inst.setMatrixAt(index, this._matrix);

    });

    this.inst.instanceMatrix.needsUpdate = true;
  }
}
