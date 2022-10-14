import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import { BufferGeometry, Group, Material, MeshBasicMaterial, Vector3 } from "three";
import { make, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { DrawShape } from "../draw-shape";

import { Dialog1Geometry } from "../dialog1";
import { CloseButtonGeometry } from "../close-button";
import { Button1Geometry } from "../button1";

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
})
export class SignupComponent extends NgtObjectProps<Group> {
  @Input() backgroundcolor = 'gray';
  @Input() closecolor = 'red';
  @Input() signupcolor = 'orange';
  @Input() bordercolor = 'black';
  @Input() textcolor = 'white'


  @Input() backgroundmaterial!: Material
  @Input() closematerial!: Material
  @Input() signupmaterial!: Material
  @Input() bordermaterial!: Material

  protected shape!: DrawShape;
  protected close!: DrawShape;
  protected border!: BufferGeometry;

  protected button!: DrawShape;
  protected buttonborder!: BufferGeometry;

  protected innerscale = <Vector3>this.scale;

  override ngOnInit(): void {
    super.ngOnInit();


    this.shape = new Dialog1Geometry()
    this.close = new CloseButtonGeometry()
    this.border = this.shape.drawborder(0.01)

    this.button = new Button1Geometry()
    this.buttonborder = this.button.drawborder(0.01, 0.01)

    if (!this.backgroundmaterial) this.backgroundmaterial = this.createBackgroundMaterial()
    if (!this.closematerial) this.closematerial = this.createCloseButtonMaterial()
    if (!this.signupmaterial) this.signupmaterial = this.createSignupButtonMaterial()
    if (!this.bordermaterial) this.bordermaterial = this.createBorderMaterial()
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.backgroundmaterial.dispose();
    this.closematerial.dispose();
    this.signupmaterial.dispose();
    this.bordermaterial.dispose();
  }

  createBackgroundMaterial(): Material {
    return new MeshBasicMaterial({ color: this.backgroundcolor })
  }

  createCloseButtonMaterial(): Material {
    return new MeshBasicMaterial({ color: this.closecolor })
  }

  createSignupButtonMaterial(): Material {
    return new MeshBasicMaterial({ color: this.signupcolor })
  }

  createBorderMaterial(): Material {
    return new MeshBasicMaterial({ color: this.bordercolor })
  }

}
