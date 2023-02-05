import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group } from "three";
import { make, NgtObjectProps } from "@angular-three/core";

import { InteractiveObjects } from "ng3-flat-ui";

import { Ng3GUI } from "../ng3-gui";

@Component({
  selector: 'ng3-gui',
  exportAs: 'ng3GUI',
  templateUrl: './gui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
}
