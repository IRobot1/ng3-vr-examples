import { Directive, Input, OnDestroy, OnInit } from "@angular/core";

import { Vector3 } from "three";
import { make, NgtTriple } from "@angular-three/core";
import { NgtGroup } from "@angular-three/core/group";

import { HorizontalLayout } from "./layout";



@Directive({
  selector: '[horizontal-layout]',
  exportAs: 'horizontalLayout',
})
export class HorizontalLayoutDirective implements OnInit, OnDestroy {
  @Input() margin = [0, 0, 0] as NgtTriple;

  private panel!: HorizontalLayout;

  constructor(private ngtgroup: NgtGroup) { }

  ngOnDestroy(): void {
    clearInterval(this.updatetimer)
    clearInterval(this.listentimer)
  }

  private updatetimer: any;
  private listentimer: any;

  ngOnInit(): void {
    const group = this.ngtgroup.instance.value;

    this.panel = new HorizontalLayout(group);
    this.panel.margin = make(Vector3, this.margin);

    this.updatetimer = setInterval(() => {
      this.panel.update();
    }, 1000 / 60)

    this.listentimer = setInterval(() => {
      this.panel.listen(group);
    }, 250)
  }
}
