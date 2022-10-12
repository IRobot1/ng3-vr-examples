import { Component, Input } from "@angular/core";
import { InteractiveObjects } from "../../flat-ui/interactive-objects";

import { Controller } from "../flat-gui";

@Component({
  selector: 'three-gui-item',
  exportAs: 'threeGUIItem',
  templateUrl: './gui-item.component.html',
})
export class ThreeGUIItemComponent  {
  @Input() width = 1;
  @Input() item!: Controller;

  @Input() selectable?: InteractiveObjects;

  get textvalue(): string {
    return this.item.object[this.item.property].toString();
  }
  get boolvalue(): boolean {
    return this.item.object[this.item.property];
  }
  get value(): number {
    return this.item.object[this.item.property];
  }
  set value(newvalue: number) {
    this.item.object[this.item.property] = newvalue;
  } 
}
