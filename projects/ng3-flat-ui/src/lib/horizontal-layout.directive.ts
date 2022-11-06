import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { NgtVector2 } from "@angular-three/core";
import { NgtGroup } from "@angular-three/core/group";

import { HorizontalLayout } from "./layout";
import { WIDTH_CHANGED_EVENT } from "./flat-ui-utils";


@Directive({
  selector: '[horizontal-layout]',
  exportAs: 'horizontalLayout',
})
export class HorizontalLayoutDirective implements OnInit, OnDestroy {
  private _margin: NgtVector2 = 0;
  @Input()
  get margin(): NgtVector2 { return this._margin }
  set margin(newvalue: NgtVector2) {
    this._margin = newvalue;
    if (this.panel) {
      this.panel.margin = newvalue;
    }
  }

  @Output() widthchange = new EventEmitter<number>();

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

    group.addEventListener(WIDTH_CHANGED_EVENT, (e: any) => {
      this.widthchange.next(e.width);
    })

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
