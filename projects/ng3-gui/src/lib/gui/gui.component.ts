import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgIf } from "@angular/common";

import { Group, Vector3 } from "three";
import { make, NgtObjectProps } from "@angular-three/core";
import { NgtGroup } from "@angular-three/core/group";

import { VerticalLayoutDirective, FlatUIColorPicker, FlatUIKeyboard, FlatUIList, FlatUIDragPanel, FlatUIInputService, FlatUINumpad, InteractiveObjects } from "ng3-flat-ui";

import { Ng3GUIItemComponent } from "../gui-item/gui-item.component";
import { Ng3GUI } from "../ng3-gui";

@Component({
  selector: 'ng3-gui',
  exportAs: 'ng3GUI',
  templateUrl: './gui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FlatUIInputService],
  standalone: true,
  imports: [
    NgIf,
    NgtGroup,
    VerticalLayoutDirective,
    FlatUIDragPanel,
    FlatUIList,
    FlatUIColorPicker,
    FlatUIKeyboard,
    FlatUINumpad,
    Ng3GUIItemComponent,
  ]
})
export class Ng3GUIComponent extends NgtObjectProps<Group> {
  @Input() gui!: Ng3GUI;

  @Input() locked = false;
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
}
