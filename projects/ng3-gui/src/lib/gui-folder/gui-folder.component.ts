import { Component, Input } from "@angular/core";
import { NgFor, NgTemplateOutlet } from "@angular/common";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";
import { NgtGroup } from "@angular-three/core/group";

import { FlatUIExpansionPanel, InteractiveObjects, VerticalLayoutDirective } from "ng3-flat-ui";

import { Ng3GUIItemComponent } from "../gui-item/gui-item.component";
import { Ng3GUI } from "../ng3-gui";

@Component({
  selector: 'ng3-gui-folder',
  exportAs: 'ng3GUIFolder',
  templateUrl: './gui-folder.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgTemplateOutlet,
    NgtGroup,
    VerticalLayoutDirective,
    FlatUIExpansionPanel,
    Ng3GUIItemComponent,
  ]
})
export class Ng3GUIFolderComponent extends NgtObjectProps<Group> {
  @Input() gui!: Ng3GUI;

  @Input() selectable?: InteractiveObjects;
}

