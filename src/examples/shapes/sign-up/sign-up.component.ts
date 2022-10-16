import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Group, Material, MeshBasicMaterial, Vector3 } from "three";
import { make, NgtObjectProps } from "@angular-three/core";

import { Dialog1Geometry } from "../dialog1";
import { CloseButtonGeometry } from "../close-button";
import { Button1Geometry } from "../button1";
import { RectangleGeometry } from "../rectangle";
import { FlatUIInputService } from "../../three-gui/flat-ui-input.service";
import { InteractiveObjects } from "../../flat-ui/interactive-objects";

export interface SignUpEvent {
  email: string;
  nickname: string;
  password: string;
}

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
})
export class SignupComponent extends NgtObjectProps<Group> {
  @Input() email: string = '';
  @Input() nickname: string = '';
  @Input() password: string = '';

  @Input() emailplaceholder: string = 'Enter email';
  @Input() nicknameplaceholder: string = 'Enter nick name';
  @Input() passwordplaceholder: string = 'Enter password';

  

  @Input() backgroundcolor = 'gray';
  @Input() closecolor = 'red';
  @Input() signupcolor = 'orange';
  @Input() bordercolor = 'black';
  @Input() textcolor = 'white'
  @Input() hovercolor = 'white'

  @Input() backgroundmaterial!: Material
  @Input() closematerial!: Material
  @Input() signupmaterial!: Material
  @Input() bordermaterial!: Material

  @Input() selectable?: InteractiveObjects;

  @Output() close = new EventEmitter<boolean>();
  @Output() signup = new EventEmitter<SignUpEvent>();

  protected panelgeometry!: BufferGeometry;
  protected closegeometry!: BufferGeometry;
  protected bordergeometry!: BufferGeometry;
  protected rectangle!: BufferGeometry;

  protected buttongeometry!: BufferGeometry;
  protected buttonborder!: BufferGeometry;

  protected innerscale = <Vector3>this.scale;

  constructor(public input: FlatUIInputService) {
    super()
  }

  override ngOnInit(): void {
    super.ngOnInit();

    const rectangle = new RectangleGeometry(this.innerscale.x - 0.15, 0.1);
    this.rectangle = rectangle.drawborder();

    const panel = new Dialog1Geometry();
    this.panelgeometry = panel.geometry;
    this.bordergeometry = panel.drawborder(0.01)

    this.closegeometry = new CloseButtonGeometry().geometry;

    const button = new Button1Geometry()
    this.buttongeometry = button.geometry;
    this.buttonborder = button.drawborder(0.01, 0.01)

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

  protected get isinputvalid(): boolean {
    var re = /\S+@\S+\.\S+/;  // basic check
    const validateEmail = re.test(this.email);
    
    return validateEmail && this.nickname.length > 0 && this.password.length > 0;
  }
  protected signupPressed() {
    if (this.isinputvalid) {
      this.signup.next({ email: this.email, nickname: this.nickname, password: this.password });
    }
  }
}
