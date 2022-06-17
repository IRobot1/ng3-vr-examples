import { Component, Input } from "@angular/core";

import { NgtTriple } from "@angular-three/core";

@Component({
  selector: 'wall', 
  template: `
        <ngt-mesh [position]="position" [rotation]="rotation" receiveShadow>
          <ngt-box-geometry [args]="scale"></ngt-box-geometry>
          <ngt-mesh-standard-material [color]="color" ></ngt-mesh-standard-material>
        </ngt-mesh>
`,
})

export class WallComponent {
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;
  @Input() color = 'white'
}
