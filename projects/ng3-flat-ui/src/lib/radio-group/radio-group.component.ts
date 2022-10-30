import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from "@angular/core";

import { Group } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { FlatUIRadioButton } from "../radio-button/radio-button.component";


@Component({
  selector: 'flat-ui-radio-group',
  exportAs: 'flatUIRadioGroup',
  templateUrl: './radio-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlatUIRadioGroup extends NgtObjectProps<Group> {
private _value: any;
  @Input()
  get value(): any { return this._value }
  set value(newvalue: any) {
    this._value = newvalue;

    const button = this.buttons.find(item => item.value == newvalue);
    if (button) {
      this.selectButton(button);
    }
  }

  @Input() enabled = true;

  buttons: Array<FlatUIRadioButton> = [];

  @Output() change = new EventEmitter<any>();

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;

  private selected?: FlatUIRadioButton;

  private selectButton(newbutton: FlatUIRadioButton) {
    if (this.selected)
      this.selected.checked = false;

    newbutton.checked = true;
    this.change.next(newbutton.value);

    this.selected = newbutton;
  }

  addbutton(button: FlatUIRadioButton) {
    this.buttons.push(button);

    button.name = this.name;
    if (this.value == button.value) {
      this.selectButton(button);
    }
  }

  removebutton(button: FlatUIRadioButton) {
    this.buttons = this.buttons.filter(item => item != button);
  }
}
