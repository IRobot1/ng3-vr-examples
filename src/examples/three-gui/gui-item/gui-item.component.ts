import { Component, Input } from "@angular/core";
import { InteractiveObjects } from "../../flat-ui/interactive-objects";
import { ListItem } from "../../flat-ui/list/list.component";

import { Controller } from "../flat-gui";
import { FlatUIInputService } from "../flat-ui-input.service";

@Component({
  selector: 'three-gui-item',
  exportAs: 'threeGUIItem',
  templateUrl: './gui-item.component.html',
})
export class ThreeGUIItemComponent  {
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
    return this.item.object[this.item.property];
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
