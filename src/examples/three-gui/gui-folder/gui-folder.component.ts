import { Component, Input } from "@angular/core";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";
import { FlatGUI } from "../flat-gui";
import { InteractiveObjects } from "../../flat-ui/interactive-objects";

@Component({
  selector: 'three-gui-folder',
  exportAs: 'threeGUIFolder',
  templateUrl: './gui-folder.component.html',
})
export class ThreeGUIFolderComponent extends NgtObjectProps<Group> {
  @Input() gui!: FlatGUI;

  @Input() selectable?: InteractiveObjects;
}
