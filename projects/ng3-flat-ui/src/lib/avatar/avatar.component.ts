import { Component, Input } from "@angular/core";

import { Mesh, Texture, TextureLoader } from "three";
import { NgtLoader, NgtObjectProps } from "@angular-three/core";

import { GlobalFlatUITheme } from "../flat-ui-theme";

@Component({
  selector: 'flat-ui-avatar',
  exportAs: 'flatUIAvatar',
  templateUrl: './avatar.component.html',
})
export class FlatUIAvatar extends NgtObjectProps<Mesh> {
  @Input()
  set url(newvalue: string) {
    if (!newvalue) return;

    const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
      this.maptexture = next;
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }
  @Input() radius = 0.07;
  @Input() initials?: string;
  @Input() iconcolor: string = GlobalFlatUITheme.ButtonColor;

  protected maptexture!: Texture;

  constructor(private loader: NgtLoader) { super(); }
}
