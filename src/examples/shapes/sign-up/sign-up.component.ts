import { Component, Input, OnInit } from "@angular/core";

import { BufferGeometry, Group } from "three";
import { NgtObjectProps, NgtTriple } from "@angular-three/core";

import { DrawShape } from "../draw-shape";

import { Dialog1Geometry } from "../dialog1";
import { CloseButtonGeometry } from "../close-button";
import { Button1Geometry } from "../button1";

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
})
export class SignupComponent extends NgtObjectProps<Group> implements OnInit {
  @Input() width = 1;
  @Input() height = 1;

  shape!: DrawShape;
  close!: DrawShape;
  border!: BufferGeometry;

  button!: DrawShape;
  buttonborder!: BufferGeometry;

  scalefactor = 1.05
  scaleborder = [this.scalefactor, this.scalefactor, this.scalefactor] as NgtTriple;

  override ngOnInit(): void {
    super.ngOnInit();

    this.shape = new Dialog1Geometry(this.width, this.height)
    this.close = new CloseButtonGeometry(0.1, 0.1)
    this.border = this.shape.drawborder(0.01)

    this.button = new Button1Geometry()
    this.buttonborder = this.button.drawborder()
  }
}
