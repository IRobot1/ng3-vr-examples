import { NgtLoader, NgtTriple } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { BufferGeometry, RepeatWrapping, Texture, TextureLoader, Vector2 } from "three";
import { InteractiveObjects } from "../flat-ui/interactive-objects";
import { FlatUIInputService } from "../three-gui/flat-ui-input.service";
import { Dialog1Geometry } from "./dialog1";

import { DrawShape } from "./draw-shape";

import { RectangleGeometry } from "./rectangle";
import { SignUpEvent } from "./sign-up/sign-up.component";


@Component({
  templateUrl: './shapes.component.html',
  providers: [FlatUIInputService]
})
export class ShapesExample implements OnInit {
  selectable = new InteractiveObjects()

  showsignin = true;

  shape!: DrawShape;
  border!: BufferGeometry;

  scale = 1.05
  scaleborder = [this.scale, this.scale, this.scale] as NgtTriple;

  texture!: Texture;

  height = 1
  width = 1

  constructor(
    private loader: NgtLoader,
    public input: FlatUIInputService
  ) { }


  ngOnInit(): void {
    this.shape = new Dialog1Geometry()
    this.border = this.shape.drawborder()

    const s = this.loader.use(TextureLoader, 'assets/uv_grid_opengl.jpg').subscribe(next => {
      this.texture = next;
      //next.offset = new Vector2(0.5, 0.5)
      //next.wrapS = next.wrapT = RepeatWrapping
      },
        () => { },
        () => { s.unsubscribe(); }
      );
  }

  signup(event: SignUpEvent) {
    console.warn('sign up', event);
  }
}
