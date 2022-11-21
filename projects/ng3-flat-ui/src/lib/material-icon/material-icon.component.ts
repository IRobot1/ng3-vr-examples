import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group, Material } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { GlobalFlatUITheme } from "../flat-ui-theme";
import { NgtGroup } from "@angular-three/core/group";
import { NgtObjectPassThrough } from "@angular-three/core";
import { NgtSobaText } from "@angular-three/soba/abstractions";

@Component({
  selector: 'flat-ui-material-icon',
  exportAs: 'flatUIMaterialIcon',
  templateUrl: './material-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgtGroup,
    NgtObjectPassThrough,
    NgtSobaText,
  ]
})
export class FlatUIMaterialIcon extends NgtObjectProps<Group> {
  private _text = '';
  @Input()
  get text(): string { return this._text }
  set text(newvalue: string) {
    if (newvalue == undefined) newvalue = '';
    this._text = newvalue;
  }

  @Input() fontsize = 0.07;

  private _labelmaterial!: Material
  @Input()
  get labelmaterial(): Material {
    if (this._labelmaterial) return this._labelmaterial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set labelmaterial(newvalue: Material) {
    this._labelmaterial = newvalue;
  }
}
