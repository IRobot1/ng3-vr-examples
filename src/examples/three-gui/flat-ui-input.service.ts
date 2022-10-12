import { Injectable } from "@angular/core";

import { Euler, Object3D, Quaternion, Vector3 } from "three";

import { UIInput } from "../flat-ui/flat-ui-utils";
import { ListItem } from "../flat-ui/list/list.component";


@Injectable()
export class FlatUIInputService {
  // input methods
  method!: UIInput;
  position = new Vector3();
  rotation = new Euler();
  scale = new Vector3(1, 1, 1);

  changeinput(input: UIInput) {
    if (this.method && this.method != input)
      this.method.inputopen = false;
    this.method = input;
  }

  shownumpad = false;

  opennumpad(object: Object3D, input: UIInput) {
    this.changeinput(input);

    object.getWorldPosition(this.position);
    this.position.y -= 0.35 * this.scale.y;
    this.position.z += 0.1;

    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.rotation.setFromQuaternion(quat);

    this.shownumpad = true;
  }

  showkeyboard = false;

  openkeyboard(object: Object3D, input: UIInput) {
    this.changeinput(input);

    object.getWorldPosition(this.position);
    this.position.x += 0.01;
    this.position.y -= 0.35 * this.scale.y;
    this.position.z += 0.1;

    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.rotation.setFromQuaternion(quat);

    this.showkeyboard = true;
  }

  showpicker = false;

  opencolor(object: Object3D, input: UIInput) {
    this.changeinput(input);

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
  selectedtext!: string;

  openlist(object: Object3D, input: UIInput, list: Array<ListItem>, selected: string) {
    this.changeinput(input);

    object.getWorldPosition(this.position);
    this.position.x -= 0.02;
    this.position.y -= 0.7 * this.scale.y;
    this.position.z += 0.1;
     

    const quat = new Quaternion()
    object.getWorldQuaternion(quat);
    this.rotation.setFromQuaternion(quat);

    this.list = list;
    this.selectedtext = this.method.text = selected;

    this.showlist = true;
  }

  listitem(item: string) {
    this.selectedtext = item;
    this.showlist = false
  }

}
