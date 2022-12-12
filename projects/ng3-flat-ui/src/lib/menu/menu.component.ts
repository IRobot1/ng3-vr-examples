import { Component, EventEmitter, Input, Output } from "@angular/core";

import { NgFor, NgIf } from "@angular/common";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";
import { NgtGroup } from "@angular-three/core/group";

import { FlatUIList, ListItem } from "../list/list.component";
import { FlatUIMaterialIcon } from "../material-icon/material-icon.component";
import { FlatUILabel } from "../label/label.component";
import { FlatUIBaseButton } from "../base-button/base-button.component";

import { InteractiveObjects } from "../interactive-objects";

export interface MenuItem {
  text: string;
  icon?: string;
  enabled: boolean;
  submenu?: Array<MenuItem>;
  selected: () => void;
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


  @Input() width = 1;

  @Input() rowheight = 0.1;
  @Input() rowspacing = 0.01;
  @Input() margin = 0.03;

  @Input() selectable?: InteractiveObjects;

  list: Array<ListItem> = [];

  get height(): number { return (this.rowheight + this.rowspacing) * this.menuitems.length + this.margin*2 };

}
