import { Component, Input } from "@angular/core";

import { Camera } from "three";
import { NgtTriple } from "@angular-three/core";

@Component({
  selector: 'tv',
  templateUrl: './tv.component.html',
})
export class TVComponent {
  @Input() name = 'tv'

  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;
  @Input() camera!: Camera;
  @Input() text = '';
}
