import { Component, EventEmitter, Input, Output } from "@angular/core";

import { NgtLoader, NgtTriple } from "@angular-three/core";

import { DoubleSide, FrontSide, TextureLoader, Texture, Side, Object3D } from "three";


@Component({
  selector: 'panel',
  templateUrl: './panel.component.html'
})
export class PanelComponent {
  @Input() name = 'panel'

  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  @Input() color = 'white';

  @Input() doublesided = false;

  @Input() selectable?: Array<Object3D>;

  @Input() set url(newvalue: string) {
    const s = this.loader.use(TextureLoader, newvalue).subscribe(next => {
      this.texture = next;
    },
      () => { },
      () => { s.unsubscribe(); }
    );
  }

  @Input() userData: any;

  @Output() panelSelected = new EventEmitter<Object3D>();

  texture!: Texture;

  get side(): Side {
    return this.doublesided ? DoubleSide : FrontSide;
  }

  constructor(private loader: NgtLoader) { }
}
