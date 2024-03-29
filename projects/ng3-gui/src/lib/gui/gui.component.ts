import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group, Vector3 } from "three";
import { make, NgtObjectProps } from "@angular-three/core";

import { FlatUIInputService, InteractiveObjects } from "ng3-flat-ui";

import { Ng3GUI } from "../ng3-gui";

@Component({
  selector: 'ng3-gui',
  exportAs: 'ng3GUI',
  templateUrl: './gui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FlatUIInputService],
})
export class Ng3GUIComponent extends NgtObjectProps<Group> {
  @Input() gui!: Ng3GUI;

  @Input() locked = false;
  @Input() sixdof = true;

  @Input() showexpand = true;
  @Input() showclose = true;
  @Input() scalable = true;

  @Input() expanded = true;

  @Input() selectable?: InteractiveObjects;

  constructor(public input: FlatUIInputService) {
    super();
  }

  override preInit() {
    super.preInit();
    this.input.scale = make(Vector3, this.scale);
  }

  pressed(keycode: string) {
    if (keycode == 'Enter') {
      this.input.method.enter.next();
    }
  }

}
