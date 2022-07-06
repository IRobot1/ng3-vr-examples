import { Component, Input } from "@angular/core";

import { NgtTriple } from "@angular-three/core";

@Component({
  selector: 'pedestal',
  templateUrl: './pedestal.component.html'
})
export class PedestalComponent {
  @Input() name = 'pedestal'
  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;
  @Input() color = 'gray';
  @Input() lightcolor = 'white';

  protected size = 0.5;
}
