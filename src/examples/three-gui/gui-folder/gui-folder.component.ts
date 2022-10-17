import { Component, Input } from "@angular/core";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";

import { FlatGUI } from "../flat-gui";

@Component({
  selector: 'three-gui-folder',
  exportAs: 'threeGUIFolder',
  templateUrl: './gui-folder.component.html',
})
export class ThreeGUIFolderComponent extends NgtObjectProps<Group> {
  @Input() gui!: FlatGUI;

  @Input() selectable?: InteractiveObjects;
}
