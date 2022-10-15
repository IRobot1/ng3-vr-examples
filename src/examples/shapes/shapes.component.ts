import { NgtLoader, NgtTriple } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { BufferGeometry, Texture } from "three";
import { InteractiveObjects } from "../flat-ui/interactive-objects";
import { FlatUIInputService } from "../three-gui/flat-ui-input.service";

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
    this.shape = new RectangleGeometry()
    this.border = this.shape.drawborder()

    //  const s = this.loader.use(TextureLoader, 'assets/label.png').subscribe(next => {
    //    this.texture = next; 
    //  },
    //    () => { },
    //    () => { s.unsubscribe(); }
    //  );
  }

  signup(event: SignUpEvent) {
    console.warn('sign up', event);
  }
}
