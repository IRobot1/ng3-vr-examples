import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

import { NgtTriple } from "@angular-three/core";

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

  get url(): string {
    return `assets/screenshots/${this.asset}.png`;
  }

  constructor(private router: Router) { }

  navigate() {
    this.router.navigate(['/' + this.asset]);
  }
}
