import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";

import { Group, Material, Vector3 } from "three";

import { NgtObjectPassThrough, NgtObjectProps } from "@angular-three/core";
import { NgtGroup } from "@angular-three/core/group";

import { FlatUILabel } from "../label/label.component";
import { FlatUIButton } from "../button/button.component";
import { FlatUIMaterialButton } from "../material-button/material-button.component";
import { InteractiveObjects } from "../interactive-objects";

import { MenuItem } from "../menu/menu.component";

interface MiniData {
  position: Vector3,
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
    this.updatemenu();
  }

  private updatemenu() {
    const list: Array<MiniData> = [];
    this._menuitems.forEach((item, index) => {
      const position = new Vector3((0.1 + this.margin) * index + 0.06, 0, 0.001);

      list.push({ position, menu: item });
    });

    this.icons = list;
  }

  @Input() margin = 0.02;

  @Input() buttonmaterial: Material | undefined;
  @Input() disabledmaterial: Material | undefined;
  @Input() outlinematerial: Material | undefined;

  @Input() selectable?: InteractiveObjects;

  @Output() selected = new EventEmitter<MenuItem>();


  protected icons: Array<MiniData> = [];
  protected text!: string;

  get width(): number { return (0.1 + this.margin) * this.menuitems.length + this.margin * 2 };

  protected hover(isover: boolean, data: MiniData) {
    this.text = isover ? data.menu.text : '';
  }

  protected pressed(item: MenuItem) {
    if (item.selected) item.selected(item);
    this.selected.next(item);
  }

  addmenuitem(menu: MenuItem) {
    this.menuitems.push(menu);
    this.updatemenu();
  }

  removemenuitem(menu: MenuItem) {
    this.menuitems = this.menuitems.filter(item => item != menu);
  }
}
