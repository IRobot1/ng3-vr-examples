import { Component, EventEmitter, Input, Output } from "@angular/core";

import { NgtTriple } from "@angular-three/core";
import { Object3D } from "three";

@Component({
  selector: 'portal',
  templateUrl: './portal.component.html',
})
export class PortalComponent {
  @Input() name = 'portal'

  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  @Input() asset = '';
  @Input() text = '';

  @Input() selectable?: Array<Object3D>;

  @Output() portalSelected = new EventEmitter<Object3D>();

  get url(): string {
    return `assets/screenshots/${this.asset}.png`;
  }
}
