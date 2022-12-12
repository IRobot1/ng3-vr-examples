import { Component, Input } from "@angular/core";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";
import { NgFor, NgIf } from "@angular/common";
import { FlatUIList, ListItem } from "../list/list.component";
import { NgtGroup } from "@angular-three/core/group";
import { InteractiveObjects } from "../interactive-objects";
import { FlatUIMaterialButton } from "../material-button/material-button.component";
import { FlatUIMaterialIcon } from "../material-icon/material-icon.component";
import { FlatUILabel } from "../label/label.component";
import { FlatUIBaseButton } from "../base-button/base-button.component";

export interface MenuItem {
  text: string;
  icon?: string;
  enabled: boolean;
  submenu?: Array<MenuItem>;
}

@Component({
  selector: 'flat-ui-menu',
  exportAs: 'flatUIMenu',
  templateUrl: './menu.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgtGroup,
    FlatUIBaseButton,
    FlatUIList,
    FlatUIMaterialIcon,
    FlatUILabel,
  ]
})
export class FlatUIMenu extends NgtObjectProps<Group> {
private _menuitems: Array<MenuItem> = [];
  @Input()
  get menuitems(): Array<MenuItem> { return this._menuitems }
  set menuitems(newvalue: Array<MenuItem>) {
    this._menuitems = newvalue;
    this.list = newvalue.map(x => <ListItem>{ text: x.text, data: x });
  }

  @Input() height = 1;
  @Input() width = 1;

  @Input() rowheight = 0.1;
  @Input() margin = 0.03;

  @Input() selectable?: InteractiveObjects;

  list: Array<ListItem> = [];

  pressed() { }
}
