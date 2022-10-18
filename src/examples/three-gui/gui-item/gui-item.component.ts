import { Component, Input } from "@angular/core";

import { Color } from "three";
import { FlatUIInputService, InteractiveObjects, ListItem } from "ng3-flat-ui";

import { Controller } from "../ng3-gui";

@Component({
  selector: 'ng3-gui-item',
  exportAs: 'ng3GUIItem',
  templateUrl: './gui-item.component.html',
})
export class Ng3GUIItemComponent  {
  @Input() width = 1;
  @Input() item!: Controller;

  @Input() selectable?: InteractiveObjects;

  constructor(public input: FlatUIInputService) { }


  get textvalue(): string {
    return this.item.object[this.item.property].toString();
  }
  set textvalue(newvalue: string) {
    this.item.setValue(newvalue);
  }

  get boolvalue(): boolean {
    return this.item.object[this.item.property];
  }
  set boolValue(newvalue: boolean) {
    this.item.setValue(newvalue);
  }

  get numbervalue(): number {
    return this.item.object[this.item.property];
  }
  set numbervalue(newvalue: number) {
    this.item.setValue(newvalue);
  }

  get colorvalue(): string {
    const value = this.item.object[this.item.property];
    if (typeof value == 'number') {
      return '#' + new Color(value).getHexString()
    }
    return value;
  }
  set colorvalue(newvalue: string) {
    this.item.setValue(newvalue);
  }

  get listvalue(): string {
    const list = (this.item._min as Array<ListItem>)
    const data = this.item.object[this.item.property];
    const item = list.find(x => x.data == data);
    return item ? item.text : '';
  }
  set listvalue(newvalue: string) {
    const list = (this.item._min as Array<ListItem>)
    const item = list.find(x => x.text == newvalue);
    if (item) {
      this.item.setValue(item.data);
    }
}

  execute() {
    const func = this.item.object[this.item.property];
    func.call(this.item.object)
  }


}
