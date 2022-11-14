import { Component, Input, EventEmitter, ChangeDetectionStrategy } from "@angular/core";

import { NgtTriple } from "@angular-three/core";


@Component({
  selector: 'link-pin',
  exportAs: 'linkPin',
  templateUrl: './link-pin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkPin {
  private _position = [0, 0, 0] as NgtTriple;
  @Input()
  get position(): NgtTriple { return this._position }
  set position(newvalue: NgtTriple) {
    this._position = newvalue;
    this.change.next(newvalue);
  }

  @Input() change = new EventEmitter<NgtTriple>();


}
