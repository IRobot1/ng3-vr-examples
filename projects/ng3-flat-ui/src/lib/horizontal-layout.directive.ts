import { Directive, Input, OnDestroy, OnInit } from "@angular/core";

import { make, NgtVector2 } from "@angular-three/core";
import { NgtGroup } from "@angular-three/core/group";

import { HorizontalLayout } from "./layout";



@Directive({
  selector: '[horizontal-layout]',
  exportAs: 'horizontalLayout',
})
export class HorizontalLayoutDirective implements OnInit, OnDestroy {
  @Input() margin: NgtVector2 = 0;

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
    this.panel.margin = this.margin;

    this.updatetimer = setInterval(() => {
      this.panel.update();
    }, 1000 / 60)

    this.listentimer = setInterval(() => {
      this.panel.listen(group);
    }, 125)
  }
}
