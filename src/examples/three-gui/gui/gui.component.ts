import { Component, Input } from "@angular/core";

import { Group, Vector3 } from "three";
import { make, NgtObjectProps } from "@angular-three/core";
import { FlatGUI } from "../flat-gui";
import { InteractiveObjects } from "../../flat-ui/interactive-objects";
import { FlatUIInputService } from "../flat-ui-input.service";

@Component({
  selector: 'three-gui',
  exportAs: 'threeGUI',
  templateUrl: './gui.component.html',
  providers: [FlatUIInputService]
})
export class ThreeGUIComponent extends NgtObjectProps<Group> {
  @Input() gui!: FlatGUI;

  @Input() selectable?: InteractiveObjects;

  constructor(public input: FlatUIInputService) {
    super();
  }

  override preInit() {
    super.preInit();
    this.input.scale = make(Vector3, this.scale);
  }
}
