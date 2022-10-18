import { Component, Input } from "@angular/core";

import { Group, Vector3 } from "three";
import { make, NgtObjectProps } from "@angular-three/core";

import { FlatUIInputService, InteractiveObjects } from "ng3-flat-ui";

import { Ng3GUI } from "../ng3-gui";

@Component({
  selector: 'ng3-gui',
  exportAs: 'ng3GUI',
  templateUrl: './gui.component.html',
  providers: [FlatUIInputService]
})
export class Ng3GUIComponent extends NgtObjectProps<Group> {
  @Input() gui!: Ng3GUI;

  @Input() selectable?: InteractiveObjects;

  constructor(public input: FlatUIInputService) {
    super();
  }

  override preInit() {
    super.preInit();
    this.input.scale = make(Vector3, this.scale);
  }
}
