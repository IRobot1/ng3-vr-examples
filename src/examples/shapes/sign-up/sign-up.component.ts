import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import { BufferGeometry, Group, Material, MeshBasicMaterial, Vector3 } from "three";
import { make, NgtObjectProps, NgtTriple } from "@angular-three/core";

import { DrawShape } from "../draw-shape";

import { Dialog1Geometry } from "../dialog1";
import { CloseButtonGeometry } from "../close-button";
import { Button1Geometry } from "../button1";
import { RectangleGeometry } from "../rectangle";
import { FlatUIInputService } from "../../three-gui/flat-ui-input.service";
import { InteractiveObjects } from "../../flat-ui/interactive-objects";

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
})
export class SignupComponent extends NgtObjectProps<Group> {
  @Input() email: string = 'hello@gmail.com';
  @Input() nickname: string = 'Nick Name';
  @Input() password: string = '*****';

  @Input() backgroundcolor = 'gray';
  @Input() closecolor = 'red';
  @Input() signupcolor = 'orange';
  @Input() bordercolor = 'black';
  @Input() textcolor = 'white'

  @Input() backgroundmaterial!: Material
  @Input() closematerial!: Material
  @Input() signupmaterial!: Material
  @Input() bordermaterial!: Material

  @Input() selectable?: InteractiveObjects;

  protected shape!: DrawShape;
  protected close!: DrawShape;
  protected border!: BufferGeometry;
  protected rectangle!: BufferGeometry;

  protected button!: DrawShape;
  protected buttonborder!: BufferGeometry;

  protected innerscale = <Vector3>this.scale;

  constructor(public input: FlatUIInputService) {
    super()
  }

  override ngOnInit(): void {
    super.ngOnInit();

    const rectangle = new RectangleGeometry(this.innerscale.x - 0.15, 0.1);
    this.rectangle = rectangle.drawborder();

    this.shape = new Dialog1Geometry()
    this.close = new CloseButtonGeometry()
    this.border = this.shape.drawborder(0.01)

    this.button = new Button1Geometry()
    this.buttonborder = this.button.drawborder(0.01, 0.01)

    if (!this.backgroundmaterial) this.backgroundmaterial = this.createBackgroundMaterial()
    if (!this.closematerial) this.closematerial = this.createCloseButtonMaterial()
    if (!this.signupmaterial) this.signupmaterial = this.createSignupButtonMaterial()
    if (!this.bordermaterial) this.bordermaterial = this.createBorderMaterial()

    this.createGeometry()
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.backgroundmaterial.dispose();
    this.closematerial.dispose();
    this.signupmaterial.dispose();
    this.bordermaterial.dispose();
  }

  createGeometry(): BufferGeometry | undefined { return undefined }

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
