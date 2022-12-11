import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { Material, Mesh } from "three";

import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";
import { NgtObjectProps } from "@angular-three/core";
import { FlatUIBaseButton } from "../base-button/base-button.component";
import { NgTemplateOutlet } from "@angular/common";
import { NgtSobaText } from "@angular-three/soba/abstractions";
import { NgIf } from "@angular/common";
import { FlatUIMaterialIcon } from "../material-icon/material-icon.component";

@Component({
  selector: 'flat-ui-material-button',
  exportAs: 'flatUIMaterialButton',
  templateUrl: './material-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FlatUIBaseButton,
    FlatUIMaterialIcon,
    ]
})
export class FlatUIMaterialButton extends NgtObjectProps<Mesh> {
  @Input() text = '';
  @Input() width = 0.1;
  @Input() height = 0.1;
  @Input() enabled = true;
  @Input() buttonmaterial!: Material;
  @Input() disabledmaterial!: Material;
  @Input() outlinematerial!: Material;
  @Input() selectable?: InteractiveObjects;

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
}
