import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef } from "@angular/core";

import { Material } from "three";

import { GlobalFlatUITheme } from "../flat-ui-theme";

import { FlatUIBaseButton } from "../base-button/base-button.component";

@Component({
  selector: 'flat-ui-button',
  exportAs: 'flatUIButton',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIButton extends FlatUIBaseButton {
  @Input() textjustify: number | 'left' | 'center' | 'right' = 'center';
  @Input() fontsize = 0.07;

  get displaytext(): string { return this.text.substring(0, this.width * 28) }

  private _labelmaterial!: Material
  @Input()
  get labelmaterial(): Material {
    if (this._labelmaterial) return this._labelmaterial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set labelmaterial(newvalue: Material) {
    this._labelmaterial = newvalue;
  }

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

}
