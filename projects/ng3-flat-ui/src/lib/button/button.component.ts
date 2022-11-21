import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { Material, Mesh } from "three";

import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";
import { NgtObjectProps } from "@angular-three/core";
import { FlatUIBaseButton } from "../base-button/base-button.component";
import { NgTemplateOutlet } from "@angular/common";
import { NgtSobaText } from "@angular-three/soba/abstractions";
import { NgIf } from "@angular/common";

@Component({
  selector: 'flat-ui-button',
  exportAs: 'flatUIButton',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FlatUIBaseButton,
    NgtSobaText,
    NgIf,
    NgTemplateOutlet,
    ]
})
export class FlatUIButton extends NgtObjectProps<Mesh> {
  @Input() text = '';
  @Input() width = 0.5;
  @Input() height = 0.1;
  @Input() enabled = true;
  @Input() buttonmaterial!: Material;
  @Input() disabledmaterial!: Material;
  @Input() outlinematerial!: Material;
  @Input() selectable?: InteractiveObjects;

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

  @Output() pressed = new EventEmitter<string>();

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

}
