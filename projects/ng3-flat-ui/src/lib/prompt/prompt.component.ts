import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NgIf } from "@angular/common";

import { Material, Mesh, Vector3 } from "three";
import { make, NgtObjectProps } from "@angular-three/core";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgtPlaneGeometry } from "@angular-three/core/geometries";
import { NgtObjectPassThrough } from "@angular-three/core";

import { GlobalFlatUITheme } from "../flat-ui-theme";

import { FlatUILabel } from "../label/label.component";
import { InteractiveObjects } from "../interactive-objects";
import { FlatUIButton } from "../button/button.component";
import { FlatUIInputText } from "../input-text/input-text.component";
import { FlatUIInputService } from "../flat-ui-input.service";
import { FlatUIKeyboard } from "../keyboard/keyboard.component";

@Component({
  selector: 'flat-ui-prompt',
  exportAs: 'flatUIPrompt',
  templateUrl: './prompt.component.html',
  standalone: true,
  providers: [FlatUIInputService],
  imports: [
    NgIf,
    NgtMesh,
    NgtObjectPassThrough,
    NgtPlaneGeometry,
    FlatUILabel,
    FlatUIButton,
    FlatUIInputText,
    FlatUIKeyboard,
  ]
})
export class FlatUIPrompt extends NgtObjectProps<Mesh> {
  @Input() title = '';
  @Input() defaultvalue = '';

  private _width = 1;
  @Input()
  get width(): number { return this._width }
  set width(newvalue: number) {
    this._width = Math.max(0.8, newvalue);
  }

  @Input() selectable?: InteractiveObjects;

  private _popupmaterial!: Material
  @Input()
  get popupmaterial(): Material {
    if (this._popupmaterial) return this._popupmaterial;
    return GlobalFlatUITheme.PopupMaterial;
  }
  set popupmaterial(newvalue: Material | undefined) {
    if (newvalue)
      this._popupmaterial = newvalue;
  }

  @Output() result = new EventEmitter<string | undefined>();

  protected height = 0.4;

  constructor(public input: FlatUIInputService) {
    super();
  }

  override preInit() {
    super.preInit();
    this.input.scale = make(Vector3, this.scale);
  }

  protected pressed(keycode: string) {
    if (keycode == 'Enter') {
      this.result.next(this.defaultvalue);
      this.close();
    }
  }

  protected close() {
    this.input.showkeyboard = false;
    this.input.closeinput();
  }
}
