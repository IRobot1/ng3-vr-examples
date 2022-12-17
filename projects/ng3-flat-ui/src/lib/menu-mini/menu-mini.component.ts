import { Component, Input } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";

import { Group, Vector3 } from "three";

import { NgtObjectPassThrough, NgtObjectProps } from "@angular-three/core";
import { NgtGroup } from "@angular-three/core/group";

import { FlatUILabel } from "../label/label.component";
import { FlatUIButton } from "../button/button.component";
import { FlatUIMaterialButton } from "../material-button/material-button.component";
import { InteractiveObjects } from "../interactive-objects";

import { MenuItem } from "../menu/menu.component";

interface MiniData {
  position: Vector3,
  icon: string,
  menu: MenuItem,
}

@Component({
  selector: 'flat-ui-menu-mini',
  exportAs: 'flatUIMenuMini',
  templateUrl: './menu-mini.component.html',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgtGroup,
    NgtObjectPassThrough,
    FlatUIMaterialButton,
    FlatUILabel,
    FlatUIButton,
  ]
})
export class FlatUIMenuMini extends NgtObjectProps<Group> {
private _menuitems: Array<MenuItem> = [];
  @Input()
  get menuitems(): Array<MenuItem> { return this._menuitems }
  set menuitems(newvalue: Array<MenuItem>) {
    this._menuitems = newvalue;

    const list: Array<MiniData> = [];
    newvalue.forEach((item, index) => {
      const position = new Vector3((0.1 + this.margin) * index + 0.06, 0, 0.001);
      
      list.push({ position, icon: item.icon ? item.icon : '', menu: item });
    });

    this.icons = list;
  }

  @Input() margin = 0.02;

  @Input() selectable?: InteractiveObjects;

  protected icons: Array<MiniData> = [];
  protected text!: string;

  get width(): number { return (0.1 + this.margin) * this.menuitems.length + this.margin*2 };

  hover(isover: boolean, data: MiniData) {
    if (isover)
      this.text = data.menu.text;
  }
}
