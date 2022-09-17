import { Component, EventEmitter, Input, Output } from "@angular/core";

import { ColorRepresentation } from "three";

import { NgtTriple } from "@angular-three/core";

import { CollisionGroup } from "../collisions/collision";

@Component({
  selector: 'drum-key',
  templateUrl: 'key.component.html',
})
export class DrumKey {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() scale = 1;

  @Input() color: ColorRepresentation = 'white';
  @Input() mass = 1;
  @Input() keycode: string = '';
  @Input() size = [0.2, 0.01, 0.2] as NgtTriple;
  @Input() fontsize = 0.2;

  @Input() collisionGroup!: CollisionGroup;

  @Output() click = new EventEmitter<string>();

  pressed() {
    this.click.emit(this.keycode);
  }
}
