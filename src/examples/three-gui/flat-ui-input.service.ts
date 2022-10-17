import { Injectable } from "@angular/core";

import { Euler, Object3D, Quaternion, Vector3 } from "three";

import { ListItem, UIInput } from "ng3-flat-ui";



@Injectable()
export class FlatUIInputService {
  // input methods
  method!: UIInput;
  position = new Vector3();
  rotation = new Euler();
  scale = new Vector3(1, 1, 1);

  changeinput(input: UIInput) {
    if (this.method && this.method != input)
      this.closeinput();
    this.method = input;
  }

  closeinput() {
    this.method.inputopen = false;
  }

  shownumpad = false;

  opennumpad(object: Object3D, input: UIInput, text: string) {
    this.changeinput(input);
    this.showkeyboard = this.showlist = this.showpicker = false;

    object.getWorldPosition(this.position);
    this.position.y -= 0.35 * this.scale.y;
    this.position.z += 0.1;

    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.rotation.setFromQuaternion(quat);

    this.method.text = text;
    this.shownumpad = true;
  }

  showkeyboard = false;
  allowenter = false;

  openkeyboard(object: Object3D, input: UIInput, text: string) {
    this.changeinput(input);
    this.showlist = this.shownumpad = this.showpicker = false;

    object.getWorldPosition(this.position);
    this.position.x += 0.01;
    this.position.y -= 0.35 * this.scale.y;
    this.position.z += 0.1;

    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.rotation.setFromQuaternion(quat);

    this.method.text = text;
    this.showkeyboard = true;
  }

  showpicker = false;

  opencolor(object: Object3D, input: UIInput) {
    this.changeinput(input);
    this.showkeyboard = this.showlist = this.shownumpad = false;

    object.getWorldPosition(this.position);
    this.position.x -= 0.02;
    this.position.y -= 0.42 * this.scale.y;
    this.position.z += 0.1;

    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.rotation.setFromQuaternion(quat);

    this.showpicker = true;
  }

  showlist = false;
  list!: Array<ListItem>;

  openlist(object: Object3D, input: UIInput, list: Array<ListItem>, selected: string) {
    this.changeinput(input);
    this.showkeyboard = this.shownumpad = this.showpicker = false;

    object.getWorldPosition(this.position);
    this.position.x -= 0.02;
    this.position.y -= 0.7 * this.scale.y;
    this.position.z += 0.1;
     

    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.rotation.setFromQuaternion(quat);

    this.list = list;
    this.method.text = selected;

    this.showlist = true;
  }

}
