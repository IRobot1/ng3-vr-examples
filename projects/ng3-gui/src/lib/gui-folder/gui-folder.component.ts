import { Component, Input } from "@angular/core";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { InteractiveObjects} from "ng3-flat-ui";

import { Ng3GUI } from "../ng3-gui";

@Component({
  selector: 'ng3-gui-folder',
  exportAs: 'ng3GUIFolder',
  templateUrl: './gui-folder.component.html',
})
export class Ng3GUIFolderComponent extends NgtObjectProps<Group> {
  @Input() gui!: Ng3GUI;

  @Input() selectable?: InteractiveObjects;
}

