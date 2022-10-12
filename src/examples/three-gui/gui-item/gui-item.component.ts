import { Component, Input } from "@angular/core";
import { InteractiveObjects } from "../../flat-ui/interactive-objects";

import { Controller } from "../flat-gui";

@Component({
  selector: 'three-gui-item',
  exportAs: 'threeGUIItem',
  templateUrl: './gui-item.component.html',
})
export class ThreeGUIItemComponent  {
  @Input() item!: Controller;
  @Input() selectable?: InteractiveObjects;

  get textvalue(): string {
    return this.item.object[this.item.property].toString();
  }

  get value(): number {
    return this.item.object[this.item.property];
  }
  set value(newvalue: number) {
    this.item.object[this.item.property] = newvalue;
  } 
}
