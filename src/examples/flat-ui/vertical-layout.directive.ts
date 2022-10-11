import { Directive, Input, OnDestroy, OnInit } from "@angular/core";

import { Vector3 } from "three";
import { make, NgtTriple } from "@angular-three/core";
import { NgtGroup } from "@angular-three/core/group";

import { VerticalLayout } from "./layout";



@Directive({
  selector: '[vertical-layout]',
  exportAs: 'verticalLayout',
})
export class VerticalLayoutDirective implements OnInit, OnDestroy {
  @Input() margin = [0, 0, 0] as NgtTriple;

  private panel!: VerticalLayout;

  constructor(private ngtgroup: NgtGroup) { }

  ngOnDestroy(): void {
    clearInterval(this.updatetimer)
    clearInterval(this.listentimer)
  }

  private updatetimer: any;
  private listentimer: any;


  ngOnInit(): void {
    const group = this.ngtgroup.instance.value;

    this.panel = new VerticalLayout(group);
    this.panel.margin = make(Vector3, this.margin);

    this.updatetimer = setInterval(() => {
      this.panel.update();
    }, 1000 / 60)

    this.listentimer = setInterval(() => {
      this.panel.listen(group);
    }, 125)
  }
}
